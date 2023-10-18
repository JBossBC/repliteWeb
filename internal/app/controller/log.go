package controller

type Log interface {
}

func GetLogController() Log {
	return getLogController()
}

func RemoveAuditLogs(ctx *gin.Context) {
	var result []byte
	var filters []dao.Log
	err := ctx.ShouldBind(&filters)

	result = service.RemoveLogs(filters).Serialize()
	_, err = ctx.Writer.Write(result)
	if err != nil {
		log.Printf("写入response信息失败:%s", err.Error())
	}
}
