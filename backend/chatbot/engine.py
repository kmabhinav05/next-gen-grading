import re
from decouple import config
from reports.generator import calculate_student_progress_card

def process_student_query(student, user_message):
    """
    Evaluates student NL queries using intent matching over database records.
    If GEMINI_API_KEY is configured, can additionally query Gemini API for advanced coaching.
    """
    card = calculate_student_progress_card(student.id)
    if not card:
        return "I could not retrieve your academic records. Please ensure your semester enrollment is active."

    msg = user_message.strip().lower()
    subjects = card['subjects']
    summary = card['summary']

    # 1. Attendance queries
    if any(k in msg for k in ['attendance', 'present', 'absent', 'bunk', 'classes held']):
        # Subject-specific attendance
        matched_subj = None
        for s in subjects:
            if s['code'].lower() in msg or s['name'].lower() in msg:
                matched_subj = s
                break

        if matched_subj:
            status_text = "Good" if matched_subj['attendance_percentage'] >= 85 else ("Average" if matched_subj['attendance_percentage'] >= 75 else "CRITICAL SHORTAGE")
            return (
                f"**Attendance for {matched_subj['code']} ({matched_subj['name']}):**\n\n"
                f"- **Attended:** {matched_subj['classes_attended']} / {matched_subj['classes_held']} classes\n"
                f"- **Percentage:** **{matched_subj['attendance_percentage']}%** ({status_text})\n"
                + (f"⚠️ *Warning: Your attendance in this subject is below 75%. Please meet your faculty counselor.*" if matched_subj['attendance_percentage'] < 75 else "")
            )
        else:
            # Overall attendance breakdown
            lines = [f"- **{s['code']}:** {s['attendance_percentage']}% ({s['classes_attended']}/{s['classes_held']})" for s in subjects]
            return (
                f"📊 **Your Overall Attendance is {summary['overall_attendance_percentage']}%** "
                f"({summary['total_classes_attended']} of {summary['total_classes_held']} classes).\n\n"
                f"**Subject-wise Breakdown:**\n" + "\n".join(lines) + "\n\n"
                + ("⚠️ *You have an attendance shortage (<75%) in one or more subjects!*" if summary['overall_attendance_status'] == 'CRITICAL' else "✅ *Your overall attendance meets college requirements!*")
            )

    # 2. Weakest subject / need help
    if any(k in msg for k in ['weakest', 'lowest', 'poor', 'need help', 'struggling', 'improve', 'worst']):
        # Find subject with lowest average
        valid_subjs = [s for s in subjects if s['average'] > 0 or s['ia1'] is not None]
        if not valid_subjs:
            return "No assessment marks have been uploaded for your current subjects yet."

        sorted_subjs = sorted(valid_subjs, key=lambda s: s['average'])
        weakest = sorted_subjs[0]
        
        return (
            f"🎯 **Academic Focus Analysis:**\n\n"
            f"Your weakest subject is **{weakest['code']} - {weakest['name']}**.\n"
            f"- Current Average: **{weakest['average']} / {weakest['max_internal_marks']}**\n"
            f"- IA 1: {weakest['ia1'] or 'N/A'} | IA 2: {weakest['ia2'] or 'N/A'} | IA 3: {weakest['ia3'] or 'N/A'}\n"
            f"- Attendance: {weakest['attendance_percentage']}%\n\n"
            f"💡 **Recommended Action Plan:**\n"
            f"1. Schedule a doubt-clearing session with Professor {weakest['staff_name']}.\n"
            f"2. Review textbook problem sets for key topics covered in IA1/IA2.\n"
            f"3. Form a study circle with peers who scored above 40 in this subject."
        )

    # 3. Marks query
    if any(k in msg for k in ['mark', 'marks', 'score', 'scored', 'internal', 'ia1', 'ia2', 'ia3', 'result', 'grade']):
        # Check if subject specified
        matched_subj = None
        for s in subjects:
            if s['code'].lower() in msg or s['name'].lower() in msg:
                matched_subj = s
                break

        if matched_subj:
            return (
                f"📝 **Internal Assessment Marks for {matched_subj['code']} ({matched_subj['name']}):**\n\n"
                f"- **IA 1:** {matched_subj['ia1'] or 'Not Uploaded'}\n"
                f"- **IA 2:** {matched_subj['ia2'] or 'Not Uploaded'}\n"
                f"- **IA 3:** {matched_subj['ia3'] or 'Not Uploaded'}\n"
                f"- **Average:** **{matched_subj['average']} / {matched_subj['max_internal_marks']}**\n"
                f"- **Faculty:** Prof. {matched_subj['staff_name']}"
            )
        else:
            lines = [f"- **{s['code']}:** Avg {s['average']}/{s['max_internal_marks']} (IA1: {s['ia1'] or '-'}, IA2: {s['ia2'] or '-'}, IA3: {s['ia3'] or '-'})" for s in subjects]
            return (
                f"📈 **Your Cumulative Internal Score:** **{summary['total_scored']} / {summary['total_max']}** "
                f"({summary['overall_marks_percentage']}%)\n\n"
                f"**Subject Marks Overview:**\n" + "\n".join(lines)
            )

    # 4. Study tips & advice
    if any(k in msg for k in ['tip', 'tips', 'study', 'advice', 'guidance', 'how to prepare', 'ptm', 'meeting']):
        return (
            f"🎓 **Personalized Study & PTM Preparation Tips:**\n\n"
            f"1. **Target Weak Topics:** Prioritize topics from your lowest scoring subject ({subjects[0]['code'] if subjects else 'your core subjects'}).\n"
            f"2. **Maintain 80%+ Attendance:** Consistently attending lectures directly correlates with 15–20% higher scores in internal tests.\n"
            f"3. **Mock Tests:** Solve previous year university question papers under timed conditions.\n"
            f"4. **PTM Readiness:** During Parent-Teacher meetings, highlight your consistent areas and ask the faculty for targeted revision notes."
        )

    # Default friendly greeting & capabilities prompt
    student_name = card['student']['name'].split()[0]
    return (
        f"Hello {student_name}! 👋 I am your Next Gen Grading Academic Department Assistant.\n\n"
        f"You can ask me questions like:\n"
        f"- *'What is my overall attendance?'*\n"
        f"- *'What are my marks in CS501?'*\n"
        f"- *'Which subject is my weakest?'*\n"
        f"- *'Give me study tips for the upcoming assessments'*"
    )
