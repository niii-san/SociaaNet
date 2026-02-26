export function extractHashtags(caption: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;

    while ((match = hashtagRegex.exec(caption)) !== null) {
        hashtags.push(match[1]);
    }

    return hashtags;
}
