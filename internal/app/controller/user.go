package controller

import "github.com/gin-gonic/gin"

type User interface {
	Register(ctx *gin.Context)
	Login(ctx *gin.Context)
	FilterUser(ctx *gin.Context)
	QueryUsers(ctx *gin.Context)
}

func GetUserController() User {
	return getUserController()
}
