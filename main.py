from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import DBmodule
import uvicorn

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/") #해당 링크에 접속했을 때
def a():
	return 'mainpage'

@app.get('/login/{ID}/{Password}')
def b(ID : str, Password : str):
	return DBmodule.Login(ID, Password)

@app.get('/register/{ID}/{Password}')
def c(ID : str, Password : str):
	return DBmodule.Register(ID, Password)

@app.get('/refreshtoken/{ID}/{Password}')
def d(ID : str, Password : str):
	return DBmodule.RefreshToken(ID, Password)
	
@app.get('/comparetoken/{ID}/{Token}')
def e(ID : str, Token : str):
	if Token[0] == '"':
		Token = Token[1:len(Token) - 1]
	return DBmodule.CompareToken(ID, Token)
	
@app.get('/writings/{StartNum}/{Limit}')
def f(StartNum, Limit):
	return DBmodule.GetWritings(int(StartNum), int(Limit), WithContent=False)

@app.get('/writingcontent/{Num}')
def g(Num):
	Num = int(Num)
	return DBmodule.GetWritings(StartNum=int(Num), Limit= 1, WithContent=True)

@app.get('/addwriting/{ID}/{Token}/{Title}/{Content}')
def h(ID, Token, Title, Content):
	if Token[0] == '"':
		Token = Token[1:len(Token) - 1]
	return DBmodule.AddWriting(ID, Token, Title, Content)

@app.get('/getcomment/{WritingNum}')
def i(WritingNum):
	return DBmodule.GetComment(WritingNum)
	

@app.get('/addcomment/{WritingNum}/{ID}/{Token}/{Comment}')
def j(WritingNum, ID, Token, Comment):
	return DBmodule.AddComment(WritingNum, ID, Token, Comment)

@app.get('/deletecomment/{WritingNum}/{ID}/{Token}')
def k(WritingNum, ID, Token):
	if Token[0] == '"':
		Token = Token[1:len(Token) - 1]
	return DBmodule.DeleteContent(WritingNum, ID, Token)

# cd "C:\Users\th070\Desktop\mysql_test\6 글쓰기"
# uvicorn main:app --reload


from threading import Thread


def RunWebserver():
	import os

	os.system('cd {}'.format(os.getcwd()))
	os.system('python -m http.server 8080')

Temp = Thread(target=RunWebserver)
Temp.start()


uvicorn.run(app, host="0.0.0.0", port=8000)


