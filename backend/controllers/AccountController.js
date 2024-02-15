import jwt from 'jsonwebtoken'
import { AccountList } from '../models/AccountModel.js'

export const Register = async (req, res) => {

    try {
        const idnExists = await AccountList.findOne({
            idn: req.body.idn,
        })

        const emailExists = await AccountList.findOne({
            email: req.body.email,
        })

        if (idnExists) {
            return res.json({
                title: 'ID Number Exist',
                message: 'ID Number already registered, try to recover your account!',
                status: 'info'
            });
        }

        if (emailExists) {
            return res.json({
                title: 'Email Exist',
                message: 'Email already in use, please report to the administrator to find your account.',
                status: 'info'
            });
        }

        const acc = new AccountList(req.body);
        await acc.save();

        return res.send({
            title: 'Account is Ready to use',
            message: 'Account Successfully Registerd, Please inform the user to login the account.',
            status: 'success'
        })
    }
    catch (error) {
        console.log(error)
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}

export const Login = async (req, res) => {
    const { idn, password } = req.body;
    await AccountList.findOne({ idn })
        .then((data) => {
            if (!data) {
                return res.send({
                    title: 'Invalid Credentials',
                    message: 'Your account is not exist, Please report to the Administrator.',
                    status: 'warning',
                    token: ''
                })
            }

            if (!data.authenticate(password)) {
                return res.send({
                    title: 'Invalid ID Number or Password',
                    message: 'Please check your ID Number and Password.',
                    status: 'warning',
                    token: ''
                })
            }

            if (data.acc_status === 'Deactivate') {
                return res.send({
                    title: 'Account Deactivated',
                    message: 'Your account is currently deactivated, Please report to the administrator.',
                    status: 'warning',
                    token: ''
                })
            }

            if (data.status === 'Online') {
                return res.send({
                    title: 'Account is Online',
                    message: 'Your account is currently Online, If you having a problem to your account please report to the Administrator.',
                    status: 'warning',
                    token: ''
                })
            }

            const { firstName, lastName, email, idn, acc_type, acc_access, acc_theme, userKey } = data;
            data.status = 'Online'
            data.save()

            const token = jwt.sign({
                firstName: firstName, lastName: lastName, email: email, idn: idn,
                acc_type: acc_type, acc_access: acc_access, userKey: userKey
            }, process.env.JWT_SECRET, { expiresIn: '12h' })

            res.cookie('access_token', token, { maxAge: 12 * 60 * 60 * 1000, httpOnly: true })

            return res.send({
                title: 'Login Successfull',
                message: `Welcome ${data.firstName}, Please check your notifications and Have a nice day.`,
                status: 'success',
                token: token,
                account_access: acc_access,
                ui_theme: acc_theme
            })
        }).catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error',
                token: ''
            });
        })
}

export const Logout = async (req, res) => {

    const status = { status: 'Offline' }
    await AccountList.updateOne({ userKey: req.params.userKey }, status)

    res.clearCookie('access_token')
    return res.json({
        message: 'Logout Successful'
    })
}


export const VerifyAccount = async (req, res) => {
    try {

        let accessToken = req.cookies.access_token
        if (!accessToken) {
            return res.json({
                response: 'unauthorized',
                token: ''
            })
        }

        const token = jwt.verify(accessToken, process.env.JWT_SECRET)
        const status = { status: 'Online' }
        await AccountList.updateOne({ userKey: token.userKey }, status)
        return res.json({
            response: 'User still logged in',
            token: token
        })

    } catch (error) {
        console.log(error)
        return res.json({
            response: 'expired',
            token: ''
        })
    }
}

export const AccountDataList = async (req, res) => {
    await AccountList.find({}, {
        idn: 1,
        lastName: 1,
        firstName: 1,
        email: 1,
        acc_type: 1,
        acc_status: 1,
        status: 1,
        userKey: 1
    })
        .sort({ lastName: 1 })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}

export const AccountDetails = async (req, res) => {
    await AccountList.find({ userKey: req.params.userKey })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}

export const UpdateAccountData = async (req, res) => {

    const { firstName, lastName, email, acc_type, acc_access, idn, acc_status, status, userKey } = req.body
    const dataContainer = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        acc_type: acc_type,
        acc_access: acc_access,
        idn: idn,
        acc_status: acc_status,
        status: status
    }

    await AccountList.updateOne({ userKey: userKey }, dataContainer)
        .then(() => {
            res.json({
                title: 'Update Successful',
                message: 'The Account Information is now updated.',
                status: 'success'
            });
        })
        .catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const UpdateAccountPassword = async (req, res) => {

    const { password, userKey } = req.body

    await AccountList.findOne({ userKey: userKey })
        .then((data) => {

            data.hashedPassword = data.encryptPassword(password)
            data.save()

            res.json({
                title: 'Update Successful',
                message: 'The Account Password is now updated.',
                status: 'success'
            });
        })
        .catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}