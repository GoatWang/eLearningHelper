// function createProgressBar(element, id, description){
//     // <div id="transcriptProgress" class="progress mb-2">
//     //     <div class="progress-bar progress-bar-striped mb-2" style="width: 20%;" >20%</div>
//     // </div>
//     // TODO: add description label
//     const progressBar = document.createElement("div");
//     progressBar.className = "progress mb-2";
//     progressBar.innerHTML = `<div id="${id}" class="progress-bar progress-bar-striped mb-2" style="width: 0%;" >0%</div>`
//     element.parentNode.insertBefore(progressBar, element.nextSibling);
//     return progressBar.querySelector('.progress-bar')
// }

function createProgressBar(div_id, description){
    const progress_div = document.getElementById(div_id);
    if (!progress_div) {
        console.error("Element with id", div_id, "not found.");
        return;
    }

    const label = document.createElement("label");
    label.innerText = description
    progress_div.appendChild(label)

    const progressBar = document.createElement("div");
    progressBar.className = "progress mb-2";
    progressBar.innerHTML = `<div class="progress-bar progress-bar-striped mb-2" style="width: 0%;" >0%</div>`
    progress_div.appendChild(progressBar)
    return progressBar.querySelector('.progress-bar')
}

function setProgressBar(progressBar, value){
    progressBar.style.width = value + '%'
    progressBar.innerText = value + '%'; // Change the text to "50%"
}

function updateProgressBar(progressBar, estimatedTime){
    const interval = (estimatedTime * 1000) / 100; // Calculate interval based on estimated time

    let currentProgress = 0;
    const progressBarInterval = setInterval(() => {
        currentProgress += 1;
        progressBar.classList.add("progress-bar-animated")
        setProgressBar(progressBar, currentProgress)
        if (currentProgress >= 99) {
            clearInterval(progressBarInterval);
        }
    }, interval);
}

function removeProgressBar(div_id){
    const progress_div = document.getElementById(div_id);
    if (!progress_div) {
        console.error("Element with id", div_id, "not found.");
        return;
    }
    const label = progress_div.querySelector("label")
    if (label) {
        progress_div.removeChild(label);
    }
    const div = progress_div.querySelector("div")
    if (label) {
        progress_div.removeChild(div);
    }
}

function setTextarea(id, text){
    const textarea = document.getElementById(id);
    textarea.innerHTML = text
}

function initPromptText(){
    setTextarea("videoPromptArea", 
                "Here is the transcript of a lecturer's video. I am planning to create a brief marketing video. Could you, as a financial or accounting practitioner, identify the proper 1~2 introduction sentences, 1~2 conclusion sentences and other 3 most important sentences in the paragraph?\
                \nplease ensure to provide orginal sentence without any additional description, along with with their respective IDs as provided in the transcript. Please ensure that the selected sentences are unique and not repeated.\
                \n\nTranscript:\
                \n{transcript}")

    setTextarea("assessmentPromptArea", 
                "Here is the transcript of a video lecture. Could you please help me create 10 multiple-choice assessment questions, each with four answer choices, and please also provide the answers at the end?\
                \n\n{transcript}\
                \n\nExample\nAssessment:\
                \n1. 1 + 1 = ?\
                \na) 1\
                \nb) 2\
                \nc) 3\
                \nd) 4\
                \n\n2. 2 x 2 = ?\
                \na) 2\
                \nb) 4\
                \nc) 6\
                \nd) 8\
                \n\nAnswer:\
                \n1. b) 2\
                \n2. b) 4")
    }


function enableVideoUploadNextSteps(transcript){
    const transcriptArea = document.getElementById("transcriptArea");
    transcriptArea.innerText = transcript
    transcriptArea.removeAttribute("disabled")

    const askChatGPTVideoBtn = document.getElementById("askChatGPTVideoBtn");
    const demoAskChatGPTVideoBtn = document.getElementById("demoAskChatGPTVideoBtn");
    askChatGPTVideoBtn.removeAttribute("disabled")
    demoAskChatGPTVideoBtn.removeAttribute("disabled")

    const askChatGPTAssessmentBtn = document.getElementById("askChatGPTAssessmentBtn");
    const demoAskChatGPTAssessmentBtn = document.getElementById("demoAskChatGPTAssessmentBtn");
    askChatGPTAssessmentBtn.removeAttribute("disabled")
    demoAskChatGPTAssessmentBtn.removeAttribute("disabled")

    const downloadTranscriptBtn = document.getElementById("downloadTranscriptBtn");
    downloadTranscriptBtn.removeAttribute("disabled")
}

function addVideoUploadEvent(){
    const videoUploadBtn = document.getElementById("videoUploadBtn");

    videoUploadBtn.addEventListener("click", () => {
        pywebview.api.open_file_dialog().then(() => {
            const progressBar1 = createProgressBar('transcriptProgress1', "Converting to mp3...")
            updateProgressBar(progressBar1, 10)
        
            // convert mp4 to mp3
            pywebview.api.video2audio().then((estimatedTime) => {
                removeProgressBar("transcriptProgress1")
                const progressBar2 = createProgressBar('transcriptProgress2', "Transcribing...")
                updateProgressBar(progressBar2, estimatedTime)
        
                // generating transcribe
                pywebview.api.transcribe().then((transcript) => {
                    removeProgressBar("transcriptProgress2")
                    enableVideoUploadNextSteps(transcript)
                }).catch(() => {
                    alert("Fail transcribing!")
        
                })                    
            }).catch(() => {
                alert("Fail reading file!")
            })

        }).catch(() => {
            alert("No file specified!");
        })
    })
}

function adddownloadTranscriptEvent(){
    const downloadTranscriptBtn = document.getElementById("downloadTranscriptBtn");
    downloadTranscriptBtn.addEventListener("click", () => {
        pywebview.api.download_transcript().then((video_fp_dst) => {
            alert("Output file has been saved to " + video_fp_dst)
            // TODO: show the download location
        })
    })
}


function json2html(jsonData) {
    let tableHTML = '<table id="reusltTable" class="table table-striped table-bordered">';
    tableHTML += '<tr>\
                <th scope="col">#</th>\
                <th scope="col">selected</th>\
                <th scope="col">sent</th>\
                <th scope="col">timestamp</th>\
                </tr>';
    
    for (const data of jsonData) {
      tableHTML += '<tr>';
      tableHTML += `<th scope="row">${data.sent_id}</td>`;
      tableHTML += `<td><input type="checkbox" ${data.selected ? 'checked' : ''}></td>`;
      tableHTML += `<td>${data.sent}</td>`;
      tableHTML += `<td>${data.st.toFixed(2)}: ${data.end.toFixed(2)}</td>`;
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    return tableHTML;
}

function addReslutTable(json_table, element){
    let html_table = json2html(JSON.parse(json_table))
    const table_div = document.getElementById("videoResultTable")
    table_div.innerHTML = html_table
}

function enableAskChatGptVideoEventNextSteps(json_table){
    addReslutTable(json_table)
    document.getElementById("clipVideoBtn").removeAttribute("disabled")
    document.getElementById("demoClipVideoBtn").removeAttribute("disabled")
}

function addAskChatGptVideoEvent(){
    const askChatGPTVideoBtn = document.getElementById("askChatGPTVideoBtn");
    const transcriptArea = document.getElementById("transcriptArea");
    const videoPromptArea = document.getElementById("videoPromptArea");

    askChatGPTVideoBtn.addEventListener("click", () => {
        const progressBar3 = createProgressBar('askChatGPTVideoProgress', "ChatGPT answer generating...")
        updateProgressBar(progressBar3, 10)

        pywebview.api.ask_chatgpt_video(videoPromptArea.value, transcriptArea.value).then((json_table) => {
            removeProgressBar("askChatGPTVideoProgress")
            enableAskChatGptVideoEventNextSteps(json_table)
        }).catch(() => {
            alert("ChatGPT connection fail!")
        })
    })
}

function addClipVideoEvent(){
    const clipVideoBtn = document.getElementById("clipVideoBtn");
    const downloadVideoBtn = document.getElementById("downloadVideoBtn");
    clipVideoBtn.addEventListener("click", () => {
        // find selected rows
        const checkboxes = document.querySelectorAll('#reusltTable input[type="checkbox"]');
        const selectedRowIds = [];
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                // Get the row number (ID) by finding the closest 'tr' ancestor and then the first 'th' child
                const rowId = parseInt(checkbox.closest('tr').querySelector('th').textContent);
                selectedRowIds.push(rowId);
            }
        });       

        const progressBar4 = createProgressBar('clipProgress', "Clipping video...")
        updateProgressBar(progressBar4, 60)
        pywebview.api.clip_video(selectedRowIds).then(() => {
            removeProgressBar("clipProgress")
            downloadVideoBtn.removeAttribute('disabled');
        }).catch(() => {
            alert("Video clipping fail!")
        })
    })
}

function adddownloadVideoEvent(){
    const downloadVideoBtn = document.getElementById("downloadVideoBtn");
    downloadVideoBtn.addEventListener("click", () => {
        pywebview.api.download_video().then((video_fp_dst) => {
            alert("Output file has been saved to " + video_fp_dst)
            // TODO: show the download location
        })
    })
}

function enableAskChatGptAssessmentEventNextSteps(assessment_result){
    const assessmentRsultArea = document.getElementById("assessmentRsultArea");
    assessmentRsultArea.removeAttribute("disabled")
    assessmentRsultArea.innerText = assessment_result
}

function addAskChatGptAssessmentEvent(){
    const askChatGPTAssessmentBtn = document.getElementById("askChatGPTAssessmentBtn");
    const assessmentPromptArea = document.getElementById("assessmentPromptArea");
    const transcriptArea = document.getElementById("transcriptArea");

    askChatGPTAssessmentBtn.addEventListener("click", () => {
            const progressBar5 = createProgressBar("askChatGPTAssessmentProgress", "ChatGPT answer generating...")
            updateProgressBar(progressBar5, 20)

            console.log("assessmentPromptArea.value")
            console.log(assessmentPromptArea.value)
            pywebview.api.ask_chatgpt_assessment(assessmentPromptArea.value, transcriptArea.value).then((assessment_result) => {
                removeProgressBar("askChatGPTAssessmentProgress")
                enableAskChatGptAssessmentEventNextSteps(assessment_result)
            }).catch(() => {
                alert("ChatGPT connection fail!")
            })
    })
}

function addDemoEvent(){
    const demoTranscribingBtn = document.getElementById("demoTranscribingBtn");
    demoTranscribingBtn.addEventListener("click", () => {
        pywebview.api.demo_transcribe().then((transcript) => {
            enableVideoUploadNextSteps(transcript)
        });
    })

    const demoAskChatGPTVideoBtn = document.getElementById("demoAskChatGPTVideoBtn");
    demoAskChatGPTVideoBtn.addEventListener("click", () => {
        pywebview.api.demo_ask_chatgpt_video().then((json_table) => {
            enableAskChatGptVideoEventNextSteps(json_table)
        });
    })

    const demoClipVideoBtn = document.getElementById("demoClipVideoBtn");
    demoClipVideoBtn.addEventListener("click", () => {
        pywebview.api.demo_clip_video().then(() => {
            downloadVideoBtn.removeAttribute('disabled');
        });
    })

    const demoAskChatGPTAssessmentBtn = document.getElementById("demoAskChatGPTAssessmentBtn");
    demoAskChatGPTAssessmentBtn.addEventListener("click", () => {
        pywebview.api.demo_ask_chatgpt_assessment().then((assessment_result) => {
            enableAskChatGptAssessmentEventNextSteps(assessment_result)
        });
    })    
}

document.addEventListener("DOMContentLoaded", function() {
    initPromptText();
    addVideoUploadEvent();
    adddownloadTranscriptEvent();
    addAskChatGptVideoEvent();
    addClipVideoEvent();
    adddownloadVideoEvent();    
    addAskChatGptAssessmentEvent();
    addDemoEvent();
    // console.log("pb.value")
    // const pb = document.getElementById("transcriptProgress");
    // console.log(pb.value)
    // pb.value=40
    // transcriptProgress
});    