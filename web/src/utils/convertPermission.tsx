import { PermissionLevel } from "@kyle/common";

export const convertPermission = (p: PermissionLevel) => {
    if (p == PermissionLevel.User) {
        return null;
    } else if (p == PermissionLevel.Admin) {
        return (
            <span style={{ color: "red", display: "inline" }}> (Admin)</span>
        );
    } else {
        <span style={{ color: "red", display: "inline" }}>
            {" "}
            (Unknown PermissionLevel)
        </span>;
    }
};
