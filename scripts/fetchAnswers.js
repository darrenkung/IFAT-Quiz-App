async function fetchAnswerKey(quizCode) {
    const repoOwner = "your-github-username";  // Change to your GitHub username
    const repoName = "IFAT-Quiz-App";  // Change to your repository name
    const filePath = `data/${quizCode}.txt`;
    const rawFileURL = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;

    try {
        const response = await fetch(rawFileURL);
        if (!response.ok) throw new Error("Quiz not found. Please check the quiz code.");
        
        const answerKey = await response.text();
        return answerKey.trim();  // Remove extra whitespace
    } catch (error) {
        console.error("Error fetching answer key:", error);
        return null;
    }
}
