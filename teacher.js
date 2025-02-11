const GITHUB_RAW_URL = "https://raw.githubusercontent.com/darrenkung/grat/main/";

async function uploadAnswerKey() {
    let fileInput = document.getElementById("answerKey");
    let quizCode = document.getElementById("quizCode").value.trim();
    if (!fileInput.files.length || !quizCode) {
        alert("Please enter a quiz code and upload a .txt file.");
        return;
    }
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = async function (e) {
        let answerKey = e.target.result.trim();
        await uploadToGitHub(quizCode, answerKey);
    };
    reader.readAsText(file);
}

async function uploadToGitHub(quizCode, answerKey) {
    let url = `https://api.github.com/repos/darrenkung/grat/contents/${quizCode}.txt`;
    let response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": "token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Upload answer key for ${quizCode}`,
            content: btoa(answerKey)
        })
    });
    if (response.ok) {
        alert("Answer key uploaded successfully!");
    } else {
        alert("Error uploading answer key.");
    }
}
