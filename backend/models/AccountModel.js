import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'

const accountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    idn: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    acc_type: {
        type: String,
        require: true,
    },
    acc_access: {
        type: String,
        require: true,
    },
    acc_theme: {
        type: String,
        default: 'Light',
    },
    acc_status: {
        type: String,
        default: 'New Account',
    },
    status: {
        type: String,
        default: 'Offline'
    },
    userKey: {
        type: String,
        require: true,
        unique: true,
    },
    salt: String,
},
    {
        timestamps: true,
    });

accountSchema.virtual('password').set(function (password) {
    // Create temp variable called _password
    this._password = password;
    //Generate a timestamp, uuidv1 gices us the unix timestamp
    this.salt = uuidv4();
    //Encrypt the password function call
    this.hashedPassword = this.encryptPassword(password);
});

// Methods
accountSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
        }
        catch (err) {
            return '';
        }
    },
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    }
}

export const AccountList = mongoose.model("AccountList", accountSchema);

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    groupDescription: {
        type: String,
        required: true,
    },
    groupCreated: {
        type: String,
        required: true,
    },
    groupLeader: {
        type: String,
        required: true,
    },
    groupLeaderKey: {
        type: String,
        required: true,
    },
    groupMembers: {
        type: String,
        required: true,
    },
    groupMembersUserKey: {
        type: String,
        required: true,
    },
    groupKey: {
        type: String,
        required: true,
        unique: true,
    },
    salt: String,
},
    {
        timestamps: true,
    });

export const GroupList = mongoose.model("GroupList", groupSchema);

const assignAccountSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    idn: {
        type: String,
        required: true,
    },
    userKey: {
        type: String,
        required: true,
    },
    assignedBy: {
        type: String,
        required: true,
    },
    assignedByUserKey: {
        type: String,
        required: true,
    },
    assignKey: {
        type: String,
        required: true,
        unique: true,
    },
    salt: String,
},
    {
        timestamps: true,
    });

export const AssignedAccount = mongoose.model("AssignedAccount", assignAccountSchema);