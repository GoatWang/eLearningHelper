import os
import shutil
import unittest
import pandas as pd
from main import Api
from pathlib import Path

class TestReadVideo(unittest.TestCase):
    def setUp(self):
        self.api = Api()
        self.api.video_fp = "/Users/jeremywang/Projects/PwcVideoClipper/data/PwcVideoTest.mp4"
        # self.api.video_fp = "/Users/jeremywang/Projects/PwcVideoClipper/data/Root Cause Analysis 150923.mp4"

        self.test_dir = os.path.join(os.path.dirname(__file__), "test")
        Path(self.test_dir).mkdir(exist_ok=True, parents=True)
        self.api.temp_dir = self.test_dir


    def tearDown(self):
        shutil.rmtree(self.test_dir)

    # def test_transcribe(self):
    #     estimated_time = self.api.video2audio()
    #     self.assertTrue(estimated_time - 5.5 < 1)
    #     self.assertTrue(os.listdir(self.test_dir)[0] == os.path.basename(self.api.video_fp)+".mp3")

    #     text = self.api.transcribe()
    #     self.assertTrue(len(text) - 190 < 5)

    #     # self.api.df_token.to_pickle("/Users/jeremywang/Projects/PwcVideoClipper/data/df_token.pkl")
    #     # with open("/Users/jeremywang/Projects/PwcVideoClipper/data/transcript.txt", 'w') as f:
    #     #     f.write(text)

    def test_ask_chatgpt(self):
        self.api.df_token = pd.read_pickle("/Users/jeremywang/Projects/PwcVideoClipper/data/df_token.pkl")
        with open("/Users/jeremywang/Projects/PwcVideoClipper/data/transcript.txt", 'r') as f:
            transcript = f.read()

        text_prompt = "Here is the transcript of a lecturer's video. I am planning to create a brief marketing video. Could you, as a financial or accounting practitioner, identify the top 10 most appealing and attention-grabbing sentences in the paragraph?\nplease just give me the orginal sentence without any description and its id.\n\n{transcript}"
        answer = self.api.ask_chatgpt(text_prompt, transcript)
        self.assertTrue(answer != "")

        self.api.df_sent.to_pickle("/Users/jeremywang/Projects/PwcVideoClipper/data/df_sent.pkl")

if __name__ == '__main__':
    unittest.main()




    # def test_gpt():
    #     from langchain import PromptTemplate
    #     transcript = "In the workplace, problems are everywhere, waiting to be solved. The question is, how good are we at solving problems? What is the best approach to tackle the challenges of problem solving? Today, I'm going to share with you the root-cost analysis method for problem solving. Welcome back to another episode of Office Ninja. In this short video, I'm introducing to you a tool that will help you tackle the task of problem solving holistically. This approach makes use of two other tools that will also be covered in the Office Ninja series. They are the five thinking frames and the problem statement tool. You will like to watch those two other videos before continuing, but you can also do so later and have another watch of this video after that. I will also introduce to you the fishbone diagram and the five wise. Let's get started. Before I dive into the root-cost analysis technique, I would like to give you a high level overview of the problem solving process. Problem solving, as I mentioned, is a process. In its most minimal form, it consists of the following five faces. Phase 1. Understand the problem and frame it in the problem statement format. Followed by Phase 2. Discovering the root causes, which is followed by the ideation of possible solutions at the same time using the fishbone diagramming method and the five wise. What follows after is Phase 3. The grouping of the solutions on the major themes of functional groupings is the same. Using the affinity diagram. Phase 4. The potential solutions are then prioritized using the ease and effect diagramming method and finally is concluded with Phase 5. Using pause-field analysis, solutions are validated and scrubbed with the help of experts and stakeholders. Problem statement, affinity diagramming, ease effect diagramming and pause-field analysis are all part of the office ninja series. Make sure you watch those videos as well. So, are you ready to learn more about root-cost analysis? Let's get started. Let me spell out the five steps that I'm going to take you through today. They are the five essential steps in root-cost analysis. At the end of the process, as explained a minute ago, you will have a set of potential solutions to your problems. Here are the five steps. Step 1. Define the problem at hand using the problem statement method. Step 2. Select the most suitable framework for the root-cost analysis. I recommend the five thinking frames. Step 3. Use the keywords or key concepts to stimulate brainstorming. If you are using the five thinking frames, then they are strategy, structure, process, people, and technology. Step 4. Review and eliminate and refine the root causes. Finally, step 5. Use the root causes to brainstorm solutions. Step 1. Be clear about the problem. Einstein is quoted as having said, if I had one hour to solve a problem, I would spend 55 minutes thinking about the problem and five minutes thinking about the solution. So, we must always start with a clear understanding of the problem. If you are familiar with the problem statement method, you are in a good place. Alternatively, make sure you are clear about what problem you are setting up to solve. Unless you have a clear understanding of what the problem is, do not continue. Don't waste your time. Gabi-shin, Gabi-shout. For a clear understanding of the problem, you must be able to solve the problem. The problem statement method, view the office ninja video for problem statement. Step 2. Selecting a framework for the root-cost analysis. I am going to introduce the fishbone diagram, which is also known as the Ishikawa fishbone. So, let me explain how it does its job. A rule of thumb in analysing anything complex is to break it down to smaller components. Hence, a good approach is to brainstorm and park the root causes under headings or topics that the team is familiar with. For example, if you are dealing with a problem in manufacturing, you might want to use the 5M's for marketing the 4Ps. But I would recommend that a generic framework for most business problems would be very well served using the 5 thinking frames. Namely, strategy, structure, process, people, and technology. But, hey, feel free to use what goes well with the team. So, in this video, I'll be using the 5 thinking frames. Don't forget to view the video on this topic. It's part of the office ninja series. Now, we have the framework for brainstorming all set up. Are you ready to move to the next step? Let's go. Step 3. Is the brainstorming stage. During this time, you would have assembled a group of people who are familiar with the problem, the context of the problem, and preferably a subject matter expert in each of the subheadings. In our example, we have people who are familiar with the strategy, structure, process, people, and technology themes of the problem. Remember, this is brainstorming. A good way to go about it is to have the fishbone diagram on a wall. And participants in the workshop write down their thoughts on a post-it note. And place it on the wall. Under each of the 5 themes above. If each of the root causes can be broken down into smaller components, it should be done with the fishbone branching out to further subbranches. By now, the fishbone looks like a fish with yellow scales. And it is now time for us to eliminate duplicates and refine the root causes. So, that was step 3. Instead of, a facilitator would walk the entire team through each of the post-it notes. And the objective is to ensure that duplicates are eliminated, and each of the remaining root causes are refined. Each one of them should be clearly understood and validated by the participants and must not be ambiguous. This is where the 5 Ys approach kicks in. It is true that the fishbone branching is a very important part of the problem. It is really quite simple. Persistently ask why until all participants feel that the cause of the problem can be questioned no further. Hence the term root cause. Get it? By now, the team are all on the same page, with the same understanding and appreciation of the root causes that lead to the problem that you are tasked to solve. In some instances, the root cause analysis stops at step 4. But I feel that the fishbone branching is a very important part of the problem. I feel that at the end of step 4, it is the best time to start thinking about possible solutions. In our practice, we will push forward and ride on the momentum of the first four steps and finish off this exercise by brainstorming on the possible solutions. Logistically, there are two ways to go about it. If space permits, you supposed it notes of a different color to represent possible solutions. Otherwise, you may move the root causes to another bot, arranging them in a great formation and start brainstorming and placing solutions beneath the problem. Now, when it's all done, you'll be amazed how the root cause analysis has taken the team from the problem statement to a whole lot of possible solutions. So, what's next? In a separate video, I will take you through to the next stage of problem solving, affinity diagramming. That is where you would reduce and summarize the detailed lists of possible solutions into solution sets. So, let me recap. There are five steps in the root cause analysis method. They are step 1, define the problem at hand using the problem statement method. Step 2, select the most suitable framework for the root cause analysis and I recommend the five thinking frames. Step 3, use the keywords or key concepts to stimulate brainstorming. Step 4, review, eliminate and refine the root causes. Finally, step 5, use the root causes to brainstorm solutions. I will leave you here and trust the team. I hope that you will follow through with the next video on affinity diagramming. So, that was another episode of Office Ninja. The Office Ninja series is our way of delivering bite-sized learning that will make a difference to your effectiveness in the office. I hope this has been a valuable learning moment for you. Remember, give it a try, use it or lose it. Thank you."
    #     answer = '''1. "In the workplace, problems are everywhere, waiting to be solved."
    #     2. "Today, I'm going to share with you the root-cost analysis method for problem solving."
    #     3. "Step 1. Define the problem at hand using the problem statement method."
    #     4. "Step 2. Select the most suitable framework for the root-cost analysis. I recommend the five thinking frames."
    #     5. "Step 5. Use the root causes to brainstorm solutions."'''

    #     prompt_template = PromptTemplate(
    #         input_variables=["transcript"],
    #         template=text_prompt
    #     )
    #     question = prompt_template.format(transcript=transcript)

    #     with open(os.path.join(self.base_dir, "key.txt"), "r") as f:
    #         OPENAI_API_KEY = f.read()
    #     llm = OpenAI(temperature=.2, model_name="gpt-3.5-turbo", openai_api_key=OPENAI_API_KEY)
    #     answer = llm.predict(question)        

    #     sents_transcript = sentence_segmentation(transcript)
    #     sents_answer = sentence_segmentation(answer)

