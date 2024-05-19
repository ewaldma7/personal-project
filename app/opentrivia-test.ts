import prisma from "@/app/lib/client";

async function loadQuestions() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=10");
        const data = await response.json();
        const results = data.results;
        for (const result of results) {
            const newQuestion = {
                question: result.question,
                choices: [...result.incorrect_answers, result.correct_answer],
                correctChoice: result.correct_answer,
                category: 'ENTERTAINMENT'
            };
        
            try {
                const existingQuestion = await prisma.question.findUnique({
                    where: {
                        question: result.question
                    },
                });
        
                if (!existingQuestion) {
                    const questionObject = await prisma.question.create({ data: newQuestion });
                    console.log('New question created:', questionObject);
                }
            } catch (error) {
                console.error('Error while processing result:', error);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

loadQuestions();