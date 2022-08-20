import time
import random
import pymysql
import hashlib
import datetime
import re
import threading

TokenAvailableMinute = 60

lock = threading.Lock()
f = open("C:/Users/th070/Desktop/mysql_test/password.txt", "r", encoding="utf-8")
pw = f.readline()
f.close()

def RefreshDB():
	global MyDB
	return pymysql.connect(
		user='root', 
		passwd=pw,
		host='127.0.0.1', 
		db='mydatabase', 
		charset='utf8'
	)
# def OpenDB():
# 	db = pymysql.connect(
# 		user='root', 
# 		passwd=pw,
# 		host='127.0.0.1', 
# 		db='mydatabase', 
# 		charset='utf8'
# 	)
# 	cursor = MyDB.cursor(pymysql.cursors.DictCursor)
# 	return db, cursor

MyDB = RefreshDB()
cursor = MyDB.cursor(pymysql.cursors.DictCursor)

#================================================================
def IsABCandNum(txt):
	CheckTexts = "abcdefghijklmnopqrstuvwxyz0123456789"
	CheckTexts = list(CheckTexts)
	for i in range(len(txt)):
		if txt[i] in CheckTexts:
			pass
		else:
			return False
	return True

def ReturnSalt(length):
	Codes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	Codes = list(Codes)
	return ''.join(random.choice(Codes) for _ in range(length))

def GetHashValue(txt, length):
	# 반드시 length 는 2의 배수
	blake  = hashlib.blake2b(txt.encode('utf-8'), digest_size=int(length / 2))
	return blake.hexdigest()
#================================================================


def Command(cmd):
	global MyDB
	# if MyDB.open == False:
	# 	MyDB = RefreshDB()
	# 	MyDB.ping()
	with lock:
		cursor.execute(cmd) # 이렇게 작성하면 cmd 를 mysql 에서 실행시킨다는 얘기
		MyDB.commit()
	# cursor.close()
	# MyDB.close()

def DeleteAll():
	Command("TRUNCATE players;")
	Command("TRUNCATE salts;")
	Command("TRUNCATE tokens;")

def GetData(cmd):
	global MyDB, cursor
	# MyDB.connect_timeout = 1
	with lock:
		cursor.execute(cmd) # cmd 를 실행시키고 반환받은 값들을 리턴함
		
		result = cursor.fetchall()
	# cursor.close()
	# MyDB.close()
	return result

def CheckAlreadyHaveID(ID, PW):
	players = GetData("SELECT * FROM players;")
	salts = GetData("SELECT * FROM salts;")

	# print(salts)
	for i in range(len(players)):
		if ID == players[i]['ID']:
			return True
	return False

def Register(ID, Password):
	if IsABCandNum(ID) and IsABCandNum(Password):
		pass
	else:
		return False
	

	AlreadHave = CheckAlreadyHaveID(ID, Password)
	if AlreadHave == True:
		return False

	try:
		Num = GetData("SELECT * FROM players ORDER BY Num DESC LIMIT 1;")[0]['Num']
		Num += 1
	except:
		Num = 0
	

	Date = time.strftime('%Y-%m-%d %H:%M:%S')

	SaltPW = ReturnSalt(30)
	PWval = Password + SaltPW
	for i in range(2):
		PWval = GetHashValue(txt=PWval + SaltPW, length=64)

	Command(f"INSERT INTO players VALUES ({Num}, '{Date}', '{ID}', '{PWval}');")
	Command(f"INSERT INTO salts VALUES ({Num}, '{ID}', '{SaltPW}');")

	return True

def RefreshToken(ID : str, Password : str):
	if not Login(ID, Password): # 로그인 실패하면 리턴시키기
		return False
	try:
		Check = GetData(f"SELECT * FROM tokens WHERE ID='{ID}';")
	except:
		return False

	ExpDate = datetime.datetime.now() + datetime.timedelta(minutes=TokenAvailableMinute)
	# ExpDate = str(ExpDate)

	try:
		Command(f"DELETE FROM tokens WHERE ID = '{ID}'")
	except:
		pass
	Token = ReturnSalt(40)
	Command(f"INSERT INTO tokens VALUES ('{ID}', '{Token}', '{ExpDate}')")
	return Token

def CompareToken(ID, Token): # 토큰 비교
	try:
		Data = GetData(f"SELECT * FROM tokens WHERE ID='{ID}' AND token = '{Token}';")
	except:
		return False
	if len(Data) == 0:
		return False
	if Data[0]['token'] != Token:
		return False
	# print(ExpDate)
	datetime_string = Data[0]['ExpDate']
	datetime_format = "%Y-%m-%d %H:%M:%S.%f"
	datetime_result = datetime.datetime.strptime(datetime_string, datetime_format)
	if (datetime_result > datetime.datetime.now()): # 아직 유효하면
		return True
	else:
		return False


	# Command(f"INSERT INTO tokens VALUES ('{ID}', '{Token}', '{ExpDate}');")


# print(CompareToken("a"))

def AddLoginLog(ID : str, Status : bool):
	Date = time.strftime('%Y-%m-%d %H:%M:%S')
	B = '0'
	if Status == True:
		B = '1'
	try:
		Command(f"INSERT INTO loginlog VALUES ('{Date}', '{ID}', '{B}');")
	except:
		pass

def Login(ID, Password, Type:str = "login"):
	if IsABCandNum(ID) and IsABCandNum(Password):
		pass
	else:
		if Type == "login":
			AddLoginLog(ID, False)
		return False

	try:
		Salts = GetData(f"SELECT * FROM salts WHERE ID='{ID}';")[0]
		SaltPW = Salts['SaltPW']
	except:
		if Type == "login":
			AddLoginLog(ID, False)
		return False

	try:
		PWval = Password + SaltPW
		for i in range(2):
			PWval = GetHashValue(txt=PWval + SaltPW, length=64)
		Check = GetData(f"SELECT * FROM players WHERE ID='{ID}' AND password='{PWval}';")
		print(f"SELECT * FROM players WHERE ID='{ID}' AND password='{PWval}';")
	except:
		if Type == "login":
			AddLoginLog(ID, False)
		return False

	if len(Check) == 0:
		if Type == "login":
			AddLoginLog(ID, False)
		return False
	if Type == "login":
		AddLoginLog(ID, True)
	return True


#================================ 글쓰기 ======================================

def CanAddToWriting(text):
	hangul = re.compile('[^ ㄱ-ㅣ가-힣]+') # 한글과 띄어쓰기를 제외한 모든 글자# 
	hangul = re.compile('[^ \u3131-\u3163\uac00-\ud7a3]+') # 위와 동일
	result = hangul.sub('', text)

	result = hangul.findall(text)

	LeftText = ''.join(result)

	CheckTexts = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_+-=[]\|;:,<.>/?"\n'
	CheckTexts = list(CheckTexts)
	for i in range(len(LeftText)):
		if LeftText[i] in CheckTexts:
			pass
		else:
			return False
	return True

def AddWriting(ID, Token, Title, Content):
	if(not CompareToken(ID, Token) or not CanAddToWriting(Title) or not CanAddToWriting(Content)):
		return False

	try:
		Num = GetData("SELECT * FROM writings ORDER BY Num DESC LIMIT 1;")[0]['Num']
		Num += 1
	except:
		Num = 0
	Date = time.strftime('%Y.%m.%d %H:%M:%S')
	Command(f"""INSERT INTO writings VALUES ({Num}, '{Title}', '{ID}', '{Date}', 0, '{Content}')""")
	return True


def GetWritings(StartNum = 0, Limit = 5, WithContent = False): # 글 제목, 작성자, 조회 등만 가져옴
	if (WithContent):
		Value = GetData(f"SELECT * FROM writings WHERE Num = {StartNum};")
		Value = int(Value[0]['Lookup']) + 1
		Command(f"UPDATE writings SET Lookup = {Value} WHERE Num = {StartNum};")

	ReturnData = []
	for i in range(StartNum, StartNum + Limit):
		try:
			Data = GetData(f"SELECT * FROM writings WHERE Num = {i};")[0]
			if WithContent:
				ReturnData.append(Data)
			else:
				ReturnData.append(Data)
		except:
			pass
	
	return ReturnData

#=============================================================
def AddComment(WritingNum, ID, Token, Comment):
	# if(not CompareToken(ID, Token) or not CanAddToWriting(Comment)):
		# return False

	try:
		Num = GetData("SELECT * FROM comments ORDER BY Num DESC LIMIT 1;")[0]['Num']
		Num += 1
	except:
		Num = 0
	Date = time.strftime('%Y.%m.%d %H:%M:%S')

	Command(f"""INSERT INTO comments VALUES ({Num}, {WritingNum}, '{ID}', '{Comment}', '{Date}')""")
	return True

def GetComment(WritingNum):
	WritingNum = int(WritingNum)
	Datas = GetData(f"SELECT * FROM comments WHERE WritingNum = {WritingNum};")

	return Datas

def DeleteContent(WritingNum, ID, Token):
	if(not CompareToken(ID, Token)):
		return False
	
	Command(f"DELETE FROM writings WHERE Num = {WritingNum};")
	Command(f"DELETE FROM comments WHERE WritingNum = {WritingNum};")
	return True

# GetComment(1)

# AddComment(1,"admin", "token", "ㄱ")
# AddComment(1,"admin", "token", "ㄴ")
# AddComment(1,"admin", "token", "ㄷ")
# AddComment(1,"admin", "token", "ㄹ")
# AddComment(1,"admin", "token", "ㅁ")

# GetWritings(0, 5, WithContent=False)


# print(RefreshToken("a" , "a"))
# print(CompareToken("a"))

# DeleteAll()
# Register("admin", "admin")
# print(Login("admin", "admin"))

# print(Login("admin", "' OR '1' = '1")) # SQL Injection 

