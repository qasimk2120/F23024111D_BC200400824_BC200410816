//Main user Schema with

import mongoose, { Schema } from 'mongoose';
const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            required: false,
            default:
                'https://th.bing.com/th/id/OIP.UdgReMosB-vhCc6_hC4jLAHaH6?rs=1&pid=ImgDetMain',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: 'Role',
        },
        googleId: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Users', UserSchema);
