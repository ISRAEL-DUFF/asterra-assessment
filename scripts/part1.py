import csv
import json
import operator

def map_csv(csv_file_path):
    """
    Reads a CSV file and creates a map with SID as key and row data as JSON.
    
    Args:
        csv_file_path (str): Path to the CSV file
        
    Returns:
        dict: Dictionary with SID as keys and properly typed JSON objects as values
        
    Raises:
        ValueError: If 'SID' column is not found in CSV
        FileNotFoundError: If CSV file doesn't exist
    """
    result_map = {}
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        if 'SID' not in reader.fieldnames:
            raise ValueError("CSV file must contain 'SID' column")
        
        for row in reader:
            sid = row['SID']
            typed_row = {}
            
            for key, value in row.items():
                if value == '':
                    typed_row[key] = value
                    continue
                
                try:
                    if '.' not in value:
                        typed_row[key] = int(value)
                    else:
                        typed_row[key] = float(value)
                except (ValueError, AttributeError):
                    typed_row[key] = value
            
            result_map[sid] = typed_row
    
    return result_map


def computeFinalGrade(total_home_work: int, exam: int, total_quizes: int) -> int:
    home_work_score = total_home_work * 10 * 0.01
    exam_score = exam * 65 * 0.01
    quiz_score = total_quizes * 25 * 0.01

    return round(home_work_score + exam_score + quiz_score)


def map_students_by_netid(json_file_path: str) -> dict:
    """
    Reads student data from a JSON file and creates a map with lowercase NetID as key.
    
    Args:
        json_file_path (str): Path to the JSON file containing student data
        
    Returns:
        dict: Dictionary with lowercase NetID as keys and student objects as values
        
    Raises:
        FileNotFoundError: If JSON file doesn't exist
        ValueError: If JSON is invalid or NetID is missing
    """
    with open(json_file_path, 'r', encoding='utf-8') as file:
        students = json.load(file)
    
    home_work_map = map_csv('data/homework_and_exams.csv')
    quiz_1_map = map_csv('data/quiz_1_grades.csv')
    quiz_2_map = map_csv('data/quiz_2_grades.csv')

    result_list_group_1 = []
    result_list_group_2 = []
    result_list_group_3 = []
    
    for student in students:
        if 'NetID' not in student:
            raise ValueError(f"Student record missing NetID: {student}")
        
        # Use NetID -> lowercase as key to both home_work and quiz maps
        netid_lower = student['NetID'].lower()
        home_work_obj = home_work_map[netid_lower]
        quiz_1_obj = quiz_1_map[netid_lower]
        quiz_2_obj = quiz_2_map[netid_lower]

        # Compute Final Grade
        ## NOTE: algorithm is follows
        """
            Home_Work_Total = 10% of Sum(Home_Work_1, Home_Work_2, Home_Work_3)
            Exam_Total = 65% of Exam_Score
            Quiz_Total = 25% of Sum(Quiz_Score_1, Quiz_Score_2)

            Final_Grade = Sum(Home_Work_Total, Exam_Total, Quiz_Total)
        """
        home_work_total = home_work_obj["Homework 1"] + home_work_obj["Homework 2"] + home_work_obj["Homework 1"]
        exam_total = home_work_obj["Exam"]
        quiz_total = quiz_1_obj['Grade'] + quiz_2_obj['Grade']
        final_score = computeFinalGrade(home_work_total, exam_total, quiz_total)

        result = {
            "Student Name": student['Name'],
            "ID Number": student['ID'],
            "Final Grade": final_score
        }

        # Split data based on group
        if student['Group'] == 1:
            result_list_group_1.append(result)
        elif student['Group'] == 2:
            result_list_group_2.append(result)
        else:
            result_list_group_3.append(result)

    
    return {
        "Group 1": result_list_group_1,
        "Group 2": result_list_group_2,
        "Group 3": result_list_group_3
    }


def json_obj_to_csv(json_obj, csv_file_path):
    data = json_obj
    
    if not isinstance(data, list):
        data = [json_obj]
    
    if len(data) == 0:
        raise ValueError("JSON data is empty")
    
    all_keys = set()
    for item in data:
        if isinstance(item, dict):
            all_keys.update(item.keys())
        else:
            raise ValueError("All items in JSON list must be objects (dictionaries)")
    
    fieldnames = ["Student Name", "ID Number", "Final Grade"]
    
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        sorted_data = sorted(data, key=operator.itemgetter('Final Grade'), reverse=True)
        writer.writerows(sorted_data)
    
    return len(data)



if __name__ == "__main__":

    group_scores = map_students_by_netid('data/students.json')
    json_obj_to_csv(group_scores['Group 1'], 'output/group_1_scores.csv')
    json_obj_to_csv(group_scores['Group 2'], 'output/group_2_scores.csv')
    json_obj_to_csv(group_scores['Group 3'], 'output/group_3_scores.csv')
    