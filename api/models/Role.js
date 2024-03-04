//Implementing role schema to manage roles and save roles to the users under main User.js schema

import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Role', RoleSchema);
