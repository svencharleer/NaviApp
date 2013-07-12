exports.getAccount = function(accountType){
    switch(accountType)
    {
        case 1:
            return "facebook";
        case 2:
            return "google";
        case 3:
            return "linkedin";
        case 4:
            return "twitter";
        default:
            return "google";
    }
};