import sqlite3
import hashlib

db_con = sqlite3.connect("ctf.db", isolation_level=None, check_same_thread=False)
db = db_con.cursor()

db.execute("CREATE TABLE IF NOT EXISTS ctf_users(ctf_user_id text PRIMARY KEY, ctf_user_password text, ctf_user_name text unique, ctf_user_email text unique, ctf_user_school text, ctf_user_score int, ctf_user_solved int, ctf_user_visible int)")
db.execute("CREATE TABLE IF NOT EXISTS ctf_problems(ctf_problem_name text PRIMARY KEY, ctf_problem_flag text unique, ctf_problem_type text, ctf_problem_contents text, ctf_problem_file text, ctf_problem_solved int, ctf_problem_score int, ctf_problem_visible int)")
db.execute("CREATE TABLE IF NOT EXISTS ctf_solved(ctf_user_id text, ctf_problem_name text)")
try:
    db.execute("INSERT INTO ctf_users(ctf_user_id, ctf_user_password, ctf_user_name, ctf_user_email, ctf_user_school, ctf_user_score, ctf_user_solved, ctf_user_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ("admin", hashlib.sha256("admin".encode()).hexdigest(), "admin", None, None, 0, 0, 0))
except:
    None