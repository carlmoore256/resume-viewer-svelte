export function formatPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function readableDate(dateString: string) {
    try {     
        const date = new Date(dateString);
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
    
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
    
        return `${month}, ${year}`;
    } catch (error) {
        return "N/A";
    }
}
