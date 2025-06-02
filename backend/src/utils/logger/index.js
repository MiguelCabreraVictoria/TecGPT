import getLogger from './loggerFactory.js';

export default {
    loginLogger: getLogger("login"),
    registerLogger: getLogger("register"),
    activityLogger: getLogger("user"),
    adminLogger: getLogger("admin"),
    gptLogger: getLogger("gpt"),
}