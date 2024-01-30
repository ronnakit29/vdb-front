import moment from "moment";

export function checkOld(birthday) {
    const now = moment();
    const birth = moment(birthday);
    const diff = now.diff(birth, "years");
    return diff
}
//