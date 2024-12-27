const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");

const REQUEST_URL = "http://localhost:3000" ;
submitButton.disabled = true;

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('cta-button--loading');
    button.disabled = true;
  } else {
    button.classList.remove('cta-button--loading');
    button.disabled = false;
  }
}

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);
const sampleTextButton = document.getElementById("sample-text-button");
const extractKeywordsButton = document.getElementById("extract-keywords-button");
const keywordsTextArea = document.getElementById("keywords");

extractKeywordsButton.addEventListener("click", () => {
  const textToAnalyze = textArea.value.trim();
  if (textToAnalyze.length < 200) {
    alert("Text must be at least 200 characters long to extract keywords.");
    return;
  }
  setButtonLoading(extractKeywordsButton, true);
  fetch(`${REQUEST_URL}/extract_keywords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textToAnalyze }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.keywords && data.keywords.length > 0) {
        keywordsTextArea.value = data.keywords.join(", ");
      } else {
        keywordsTextArea.value = "No significant keywords found.";
      }
    })
    .catch((error) => {
      console.error("Error extracting keywords:", error);
      keywordsTextArea.value = "Error extracting keywords.";
    })
    .finally(() => {
    setButtonLoading(extractKeywordsButton, false);
    });
});

sampleTextButton.addEventListener("click", () => {
  setButtonLoading(sampleTextButton, true);
  const sampleText = "Servers are the backbone of modern technology infrastructure, playing a pivotal role in storing, processing, and managing data for a wide array of applications. They come in various forms, including physical hardware, virtualized instances, and cloud-based solutions, each catering to specific needs. Physical servers, typically housed in data centers, offer dedicated resources and are often used for large-scale enterprise applications. Virtual servers, created using virtualization software, allow multiple operating systems to run on a single physical machine, enhancing resource utilization and cost efficiency. Cloud servers, on the other hand, provide scalable and flexible computing power, enabling businesses to adjust resources on demand and reduce upfront infrastructure costs. Servers are categorized based on their functions, such as web servers, application servers, database servers, and file servers, among others. A web server handles requests for websites and serves the requested pages to users, while an application server facilitates the execution of application-specific tasks. Database servers manage structured data storage and retrieval, ensuring high performance for queries and transactions. File servers, meanwhile, store and manage access to files across a network. As technology advances, servers are becoming increasingly powerful, energy-efficient, and secure, with innovations like edge computing and serverless architecture redefining how computing resources are managed and deployed.";
  textArea.value = sampleText;
  verifyTextLength({ target: textArea });

  setTimeout(() => {
    setButtonLoading(sampleTextButton, false);
  }, 500);
});

function verifyTextLength(e) {
  const textarea = e.target;
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function submitData(e) {
  setButtonLoading(submitButton, true);
  const text_to_summarize = textArea.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch(`${REQUEST_URL}/summarize`, requestOptions)
    .then((response) => response.text())
    .then(summary => {
      summarizedTextArea.value = summary;
      })
    .catch((error) => console.error(error))
    .finally(() => {
    setButtonLoading(submitButton, false);
  });

}