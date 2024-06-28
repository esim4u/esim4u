export const highlightMatches = (search: string, text: string) => {
    if (search.trim() === "") {
        return text;
    }
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, index) => {
        return regex.test(part) ? (
            <span key={index} className="highlight text-tgaccent">
                {part}
            </span>
        ) : (
            part
        );
    });
};
