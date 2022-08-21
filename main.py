from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
import DBmodule
import uvicorn
from threading import Thread
import os

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

def RemoveFirstEndToken(Token):
	if Token[0] == '"':
		return Token[1:len(Token) - 1]
	
	return Token


@app.get("/")
def a(request : Request):
	return request.client.host

#============================== 계정 관련 ==============================
@app.get('/login/{ID}/{Password}') #LOGIN
def b(ID : str, Password : str, request : Request):
	return DBmodule.Login(request.client.host, ID, Password)

@app.get('/register/{ID}/{Password}') #REGISTER
def c(ID : str, Password : str, request : Request):
	return DBmodule.Register(request.client.host, ID, Password)

@app.get('/refreshtoken/{ID}/{Password}') #REFRESH TOKEN
def d(ID : str, Password : str, request : Request):
	return DBmodule.RefreshToken(request.client.host, ID, Password)
	
@app.get('/comparetoken/{ID}/{Token}') #COMPARE TOKEN
def e(ID : str, Token : str, request : Request):
	Token = RemoveFirstEndToken(Token)
	return DBmodule.CompareToken(request.client.host, ID, Token)

#============================== 글 관련 ==============================
@app.get('/writings/{StartNum}/{Limit}') #GET WRITINGS
def f(StartNum, Limit, request : Request):
	return DBmodule.GetWritings(request.client.host, int(StartNum), int(Limit), WithContent=False)

@app.get('/writingcontent/{Num}') #WRITING CONTENT
def g(Num, request : Request):
	Num = int(Num)
	return DBmodule.GetWritings(request.client.host, StartNum=int(Num), Limit= 1, WithContent=True)

@app.get('/addwriting/{ID}/{Token}/{Title}/{Content}') #ADD WRITING
def h(ID, Token, Title, Content, request : Request):
	Token = RemoveFirstEndToken(Token)
	return DBmodule.AddWriting(request.client.host, ID, Token, Title, Content)

@app.get('/deletecontent/{WritingNum}/{ID}/{Token}') #DELETE CONTENT
def k(WritingNum, ID, Token, request : Request):
	Token = RemoveFirstEndToken(Token)
	return DBmodule.DeleteContent(request.client.host, WritingNum, ID, Token)

#============================== 댓글 관련 ==============================

@app.get('/getcomment/{WritingNum}') #GET COMMENT
def i(WritingNum, request : Request):
	return DBmodule.GetComment(request.client.host, WritingNum)
	
@app.get('/addcomment/{WritingNum}/{ID}/{Token}/{Comment}') #ADD COMMENT
def j(WritingNum, ID, Token, Comment, request : Request):
	Token = RemoveFirstEndToken(Token)
	return DBmodule.AddComment(request.client.host, WritingNum, ID, Token, Comment)



#============================== RUN ==============================

def RunWebserver():
	os.system('cd {}'.format(os.getcwd()))
	os.system('python -m http.server 8080')

Temp = Thread(target=RunWebserver)
Temp.start()


uvicorn.run(app, host="0.0.0.0", port=8000)


