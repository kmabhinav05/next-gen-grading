from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from academics.models import Semester, Staff, Student, Parent, ParentStudent, Subject
from marks.models import InternalMark, UploadLog
from attendance.models import Attendance

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds database with comprehensive college department demo data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding academic department data into MySQL database..."))

        with transaction.atomic():
            # 1. Admin Account
            admin_user, _ = User.objects.get_or_create(
                username='admin',
                defaults={
                    'email': 'admin@college.edu',
                    'first_name': 'Super',
                    'last_name': 'Administrator',
                    'role': 'ADMIN',
                    'is_staff': True,
                    'is_superuser': True,
                    'phone_number': '+91 9876543210',
                }
            )
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("[OK] Admin created: admin / admin123"))

            # 2. Semesters
            sem5, _ = Semester.objects.get_or_create(
                number=5,
                academic_year='2026-2027'
            )
            sem6, _ = Semester.objects.get_or_create(
                number=6,
                academic_year='2026-2027'
            )
            self.stdout.write(self.style.SUCCESS("[OK] Semesters created: Sem 5 & Sem 6 (2026-2027)"))

            # 3. Staff Accounts
            staff1_user, _ = User.objects.get_or_create(
                username='staff_sharma',
                defaults={
                    'email': 'r.sharma@college.edu',
                    'first_name': 'Ramesh',
                    'last_name': 'Sharma',
                    'role': 'STAFF',
                    'is_staff': True,
                    'phone_number': '+91 9876500001',
                }
            )
            staff1_user.set_password('staff123')
            staff1_user.save()

            # Also allow username 'staff1' for quick demo login
            staff1_alias, _ = User.objects.get_or_create(
                username='staff1',
                defaults={
                    'email': 'staff1@college.edu',
                    'first_name': 'Arjun',
                    'last_name': 'Menon',
                    'role': 'STAFF',
                    'is_staff': True,
                    'phone_number': '+91 9876500099',
                }
            )
            staff1_alias.set_password('staff123')
            staff1_alias.save()
            staff1, _ = Staff.objects.get_or_create(
                user=staff1_user,
                defaults={
                    'department': 'Computer Science & Engineering',
                    'designation': 'Associate Professor'
                }
            )
            Staff.objects.get_or_create(
                user=staff1_alias,
                defaults={
                    'department': 'Computer Science & Engineering',
                    'designation': 'Senior Teacher'
                }
            )

            staff2_user, _ = User.objects.get_or_create(
                username='staff_verma',
                defaults={
                    'email': 'p.verma@college.edu',
                    'first_name': 'Priya',
                    'last_name': 'Verma',
                    'role': 'STAFF',
                    'is_staff': True,
                    'phone_number': '+91 9876500002',
                }
            )
            staff2_user.set_password('staff123')
            staff2_user.save()
            staff2, _ = Staff.objects.get_or_create(
                user=staff2_user,
                defaults={
                    'department': 'Computer Science & Engineering',
                    'designation': 'Assistant Professor'
                }
            )
            self.stdout.write(self.style.SUCCESS("[OK] Staff created: staff_sharma, staff_verma / staff123"))

            # 4. Subjects
            sub1, _ = Subject.objects.get_or_create(
                code='CS501',
                defaults={
                    'name': 'Database Management Systems',
                    'semester': sem5,
                    'staff': staff1,
                    'max_internal_marks': 50
                }
            )
            sub2, _ = Subject.objects.get_or_create(
                code='CS502',
                defaults={
                    'name': 'Operating Systems',
                    'semester': sem5,
                    'staff': staff2,
                    'max_internal_marks': 50
                }
            )
            sub3, _ = Subject.objects.get_or_create(
                code='CS503',
                defaults={
                    'name': 'Computer Networks',
                    'semester': sem5,
                    'staff': staff1,
                    'max_internal_marks': 50
                }
            )
            sub4, _ = Subject.objects.get_or_create(
                code='CS504',
                defaults={
                    'name': 'Software Engineering',
                    'semester': sem5,
                    'staff': staff2,
                    'max_internal_marks': 50
                }
            )
            self.stdout.write(self.style.SUCCESS("[OK] Subjects created: CS501, CS502, CS503, CS504"))

            # 5. Students
            students_data = [
                ('student1', 'aarav@student.edu', 'Aarav', 'Patel', '21CS001', 'A'),
                ('student2', 'diya@student.edu', 'Diya', 'Sharma', '21CS002', 'A'),
                ('student3', 'rohan@student.edu', 'Rohan', 'Iyer', '21CS003', 'A'),
                ('student4', 'ananya@student.edu', 'Ananya', 'Sen', '21CS004', 'A'),
                ('student5', 'vikram@student.edu', 'Vikram', 'Singh', '21CS005', 'A'),
                ('student6', 'neha@student.edu', 'Neha', 'Reddy', '21CS006', 'A'),
            ]

            created_students = []
            for uname, mail, fn, ln, reg, sec in students_data:
                u, _ = User.objects.get_or_create(
                    username=uname,
                    defaults={
                        'email': mail,
                        'first_name': fn,
                        'last_name': ln,
                        'role': 'STUDENT',
                        'phone_number': f'+91 99000{reg[-4:]}',
                    }
                )
                u.set_password('student123')
                u.save()

                stu, _ = Student.objects.get_or_create(
                    reg_no=reg,
                    defaults={
                        'user': u,
                        'department': 'Computer Science & Engineering',
                        'semester': sem5,
                        'section': sec
                    }
                )
                created_students.append(stu)
            self.stdout.write(self.style.SUCCESS(f"[OK] Students created: {len(created_students)} students (student1..student6 / student123)"))

            # 6. Parents
            p1_user, _ = User.objects.get_or_create(
                username='parent_patel',
                defaults={
                    'email': 'suresh.patel@gmail.com',
                    'first_name': 'Suresh',
                    'last_name': 'Patel',
                    'role': 'PARENT',
                    'phone_number': '+91 9822114455'
                }
            )
            p1_user.set_password('parent123')
            p1_user.save()

            # Also allow username 'parent1' for quick demo login
            p1_alias, _ = User.objects.get_or_create(
                username='parent1',
                defaults={
                    'email': 'parent1@college.edu',
                    'first_name': 'Nadia',
                    'last_name': 'Khan',
                    'role': 'PARENT',
                    'phone_number': '+91 9822114499'
                }
            )
            p1_alias.set_password('parent123')
            p1_alias.save()

            parent1, _ = Parent.objects.get_or_create(user=p1_user, defaults={'relationship': 'Father'})
            parent_alias_obj, _ = Parent.objects.get_or_create(user=p1_alias, defaults={'relationship': 'Mother'})
            ParentStudent.objects.get_or_create(parent=parent1, student=created_students[0]) # Aarav
            ParentStudent.objects.get_or_create(parent=parent_alias_obj, student=created_students[0]) # Aarav

            p2_user, _ = User.objects.get_or_create(
                username='parent_sen',
                defaults={
                    'email': 'meenakshi.sen@gmail.com',
                    'first_name': 'Meenakshi',
                    'last_name': 'Sen',
                    'role': 'PARENT',
                    'phone_number': '+91 9833221100'
                }
            )
            p2_user.set_password('parent123')
            p2_user.save()
            parent2, _ = Parent.objects.get_or_create(user=p2_user, defaults={'relationship': 'Mother'})
            ParentStudent.objects.get_or_create(parent=parent2, student=created_students[3]) # Ananya
            self.stdout.write(self.style.SUCCESS("[OK] Parents created: parent_patel (Aarav), parent_sen (Ananya) / parent123"))

            # 7. Internal Marks & Attendance Data
            # Aarav (High): IA1 45, IA2 47, Held 40, Attended 38 (95%)
            # Diya (High): IA1 44, IA2 46, Held 40, Attended 37 (92.5%)
            # Rohan (Moderate): IA1 34, IA2 36, Held 40, Attended 32 (80%)
            # Ananya (Low & Warning): CS502 IA1 21, IA2 24 (Weak), Held 40, Attended 27 (67.5% Critical Shortage)
            # Vikram (Average): IA1 32, IA2 35, Held 40, Attended 33 (82.5%)
            # Neha (High): IA1 48, IA2 49, Held 40, Attended 39 (97.5%)

            marks_profile = [
                # (student_idx, subject, ia1, ia2, classes_held, classes_attended)
                (0, sub1, 46.0, 48.0, 40, 38),
                (0, sub2, 44.0, 45.0, 42, 40),
                (0, sub3, 42.0, 45.0, 38, 36),
                (0, sub4, 45.0, 47.0, 36, 35),

                (1, sub1, 43.0, 45.0, 40, 37),
                (1, sub2, 41.0, 44.0, 42, 39),
                (1, sub3, 40.0, 42.0, 38, 35),
                (1, sub4, 44.0, 46.0, 36, 34),

                (2, sub1, 33.0, 35.0, 40, 31),
                (2, sub2, 31.0, 34.0, 42, 33),
                (2, sub3, 35.0, 36.0, 38, 30),
                (2, sub4, 32.0, 33.0, 36, 28),

                # Ananya: Weak in CS502, Critical attendance in CS502 and CS503 (<75%)
                (3, sub1, 30.0, 32.0, 40, 31),
                (3, sub2, 21.0, 23.0, 42, 27), # 27/42 = 64.2% CRITICAL
                (3, sub3, 24.0, 26.0, 38, 26), # 26/38 = 68.4% CRITICAL
                (3, sub4, 32.0, 34.0, 36, 30),

                (4, sub1, 36.0, 38.0, 40, 33),
                (4, sub2, 34.0, 36.0, 42, 35),
                (4, sub3, 33.0, 35.0, 38, 32),
                (4, sub4, 35.0, 37.0, 36, 31),

                (5, sub1, 48.0, 49.0, 40, 39),
                (5, sub2, 47.0, 48.0, 42, 41),
                (5, sub3, 46.0, 47.0, 38, 37),
                (5, sub4, 48.0, 50.0, 36, 35),
            ]

            for s_idx, subj, m1, m2, held, attended in marks_profile:
                st = created_students[s_idx]
                # Marks IA1
                InternalMark.objects.update_or_create(
                    student=st,
                    subject=subj,
                    assessment='IA1',
                    defaults={'marks': m1, 'max_marks': subj.max_internal_marks}
                )
                # Marks IA2
                InternalMark.objects.update_or_create(
                    student=st,
                    subject=subj,
                    assessment='IA2',
                    defaults={'marks': m2, 'max_marks': subj.max_internal_marks}
                )
                # Attendance
                Attendance.objects.update_or_create(
                    student=st,
                    subject=subj,
                    defaults={'classes_held': held, 'classes_attended': attended}
                )

            # 8. Sample Upload Logs
            UploadLog.objects.get_or_create(
                subject=sub1,
                assessment='IA1',
                defaults={
                    'staff': staff1,
                    'filename': 'CS501_IA1_Batch_Upload.xlsx',
                    'status': 'SUCCESS',
                    'total_rows': 6,
                    'valid_rows': 6,
                    'invalid_rows': 0,
                    'error_summary': 'Initial bulk upload for IA1 completed without errors.'
                }
            )
            UploadLog.objects.get_or_create(
                subject=sub2,
                assessment='IA1',
                defaults={
                    'staff': staff2,
                    'filename': 'CS502_IA1_Marks.xlsx',
                    'status': 'SUCCESS',
                    'total_rows': 6,
                    'valid_rows': 6,
                    'invalid_rows': 0,
                    'error_summary': 'Verified and confirmed.'
                }
            )

        self.stdout.write(self.style.SUCCESS("All seed data created successfully! Database is fully initialized."))
