from decimal import Decimal
from academics.models import Student, Subject
from marks.models import InternalMark
from attendance.models import Attendance

def calculate_student_progress_card(student_id):
    """
    Computes complete progress report data for a student:
    - Subject-wise IA1, IA2, IA3 marks, total, average, max
    - Subject-wise attendance held, attended, percentage
    - Overall marks percentage & overall attendance percentage
    - Automated qualitative remarks and attendance alerts
    """
    try:
        student = Student.objects.select_related('user', 'semester').get(id=student_id)
    except Student.DoesNotExist:
        return None

    semester = student.semester
    if not semester:
        return None

    subjects = Subject.objects.filter(semester=semester).select_related('staff__user').order_by('code')

    # Fetch marks and attendance in batch
    marks_qs = InternalMark.objects.filter(student=student, subject__in=subjects)
    attendance_qs = Attendance.objects.filter(student=student, subject__in=subjects)

    marks_map = {}
    for m in marks_qs:
        key = (m.subject_id, m.assessment)
        marks_map[key] = float(m.marks)

    attendance_map = {a.subject_id: a for a in attendance_qs}

    subject_reports = []
    total_scored = 0.0
    total_max = 0.0
    total_held = 0
    total_attended = 0
    weak_subjects = []
    critical_attendance_subjects = []

    for subj in subjects:
        ia1 = marks_map.get((subj.id, 'IA1'))
        ia2 = marks_map.get((subj.id, 'IA2'))
        ia3 = marks_map.get((subj.id, 'IA3'))

        scored_list = [m for m in [ia1, ia2, ia3] if m is not None]
        subj_total = sum(scored_list) if scored_list else 0.0
        subj_avg = round(subj_total / len(scored_list), 1) if scored_list else 0.0
        subj_max = float(subj.max_internal_marks)

        total_scored += subj_total
        total_max += (subj_max * len(scored_list)) if scored_list else 0.0

        # Attendance
        att = attendance_map.get(subj.id)
        held = att.classes_held if att else 0
        attended = att.classes_attended if att else 0
        att_pct = round((attended / held * 100), 1) if held > 0 else 100.0
        att_status = 'NORMAL' if att_pct > 85 else ('WARNING' if att_pct >= 75 else 'CRITICAL')

        total_held += held
        total_attended += attended

        # Assessment of weakness (average < 50% of max)
        if scored_list and (subj_avg < (subj_max * 0.5)):
            weak_subjects.append(f"{subj.code} ({subj.name})")

        if att_pct < 75.0 and held > 0:
            critical_attendance_subjects.append(f"{subj.code} ({att_pct}%)")

        subject_reports.append({
            'subject_id': subj.id,
            'code': subj.code,
            'name': subj.name,
            'staff_name': subj.staff.user.get_full_name() if subj.staff else 'TBA',
            'max_internal_marks': subj_max,
            'ia1': ia1,
            'ia2': ia2,
            'ia3': ia3,
            'total': round(subj_total, 1),
            'average': subj_avg,
            'classes_held': held,
            'classes_attended': attended,
            'attendance_percentage': att_pct,
            'attendance_status': att_status,
        })

    overall_marks_pct = round((total_scored / total_max * 100), 1) if total_max > 0 else 0.0
    overall_att_pct = round((total_attended / total_held * 100), 1) if total_held > 0 else 100.0

    overall_att_status = 'NORMAL'
    if overall_att_pct < 75.0:
        overall_att_status = 'CRITICAL'
    elif overall_att_pct <= 85.0:
        overall_att_status = 'WARNING'

    # Auto remarks generation
    remarks = []
    if overall_marks_pct >= 85:
        remarks.append("Distinction performance: Consistently demonstrates outstanding academic grasp.")
    elif overall_marks_pct >= 65:
        remarks.append("Good academic progress: Maintaining consistent understanding.")
    elif overall_marks_pct >= 50:
        remarks.append("Average performance: Regular revision and practice recommended.")
    elif total_max > 0:
        remarks.append("Needs urgent academic intervention: Significant improvement needed before final exams.")

    if weak_subjects:
        remarks.append(f"Requires special focus in: {', '.join(weak_subjects)}.")

    if critical_attendance_subjects:
        remarks.append(f"WARNING - Critical attendance shortage in: {', '.join(critical_attendance_subjects)}. Parent meeting required.")
    elif overall_att_pct >= 85:
        remarks.append("Exemplary attendance record.")

    return {
        'student': {
            'id': student.id,
            'reg_no': student.reg_no,
            'name': student.user.get_full_name() or student.user.username,
            'email': student.user.email,
            'phone': student.user.phone_number,
            'department': student.department,
            'semester': semester.number,
            'academic_year': semester.academic_year,
            'section': student.section,
        },
        'subjects': subject_reports,
        'summary': {
            'total_scored': round(total_scored, 1),
            'total_max': round(total_max, 1),
            'overall_marks_percentage': overall_marks_pct,
            'total_classes_held': total_held,
            'total_classes_attended': total_attended,
            'overall_attendance_percentage': overall_att_pct,
            'overall_attendance_status': overall_att_status,
            'remarks': " ".join(remarks),
            'weak_subjects': weak_subjects,
        }
    }
