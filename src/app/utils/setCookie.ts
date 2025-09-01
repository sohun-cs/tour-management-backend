import { Response } from "express"


export interface AuthInfo {
    accessToken?: string,
    refreshToken?: string
}


export const setCookie = async (res: Response, loginInfo: AuthInfo) => {

    if (loginInfo.accessToken) {
        res.cookie("accessToken", loginInfo.accessToken, {
            httpOnly: true,
            secure: false
        })
    }

    if (loginInfo.accessToken) {
        res.cookie('refreshToken', loginInfo.refreshToken, {
            httpOnly: true,
            secure: false
        })
    }


}