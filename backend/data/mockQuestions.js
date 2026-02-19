const mockQuestions = {
  python: {
    technical: [
      "What is the difference between list and tuple in Python?",
      "Explain decorators in Python.",
      "What are generators and how do they work?"
    ],
    coding: [
      "Write a function to reverse a string without using built-in methods.",
      "Find duplicate elements in an array and return them."
    ],
    behavioral: [
      "Tell me about a challenging Python project you solved.",
      "How do you debug complex Python code?"
    ]
  },

  java: {
    technical: [
      "Explain the four OOP principles in Java.",
      "What is the difference between HashMap and Hashtable?",
      "What is the JVM and how does garbage collection work?"
    ],
    coding: [
      "Reverse a string without using built-in methods.",
      "Find the first non-repeating character in a string."
    ],
    behavioral: [
      "Describe a challenging Java project you worked on.",
      "How do you handle code reviews and feedback?"
    ]
  },

  frontend: {
    technical: [
      "Explain the Virtual DOM in React and how it improves performance.",
      "What are CSS Grid and Flexbox? When would you use each?",
      "Explain event delegation and how it works in browsers."
    ],
    coding: [
      "Write a React Hook to fetch data on component mount.",
      "Create a debounce function to handle API calls."
    ],
    behavioral: [
      "Describe a responsive design project you built.",
      "How do you approach performance optimization?"
    ]
  },

  backend: {
    technical: [
      "Explain REST API principles and HTTP methods.",
      "What is the difference between SQL and NoSQL databases?",
      "How do you implement authentication and authorization?"
    ],
    coding: [
      "Design a database schema for a social media platform.",
      "Write an API endpoint that handles pagination."
    ],
    behavioral: [
      "Describe a backend system you designed from scratch.",
      "How do you handle database scaling?"
    ]
  },

  "data science": {
    technical: [
      "Explain the bias-variance tradeoff.",
      "What is cross-validation and why is it important?",
      "How do you handle missing data in a dataset?"
    ],
    coding: [
      "Build a simple machine learning model using scikit-learn.",
      "Write code to normalize a pandas DataFrame."
    ],
    behavioral: [
      "Describe a machine learning project you led end-to-end.",
      "How do you communicate insights to non-technical stakeholders?"
    ]
  },

  devops: {
    technical: [
      "Explain CI/CD pipelines and their benefits.",
      "What is containerization? How does Docker work?",
      "Explain Infrastructure as Code (IaC)."
    ],
    coding: [
      "Write a Dockerfile for a Node.js application.",
      "Create a basic Kubernetes deployment YAML."
    ],
    behavioral: [
      "Describe your experience managing production deployments.",
      "How do you handle system outages?"
    ]
  },

  cloud: {
    technical: [
      "Explain the difference between IaaS, PaaS, and SaaS.",
      "Design a scalable cloud architecture for an e-commerce platform.",
      "How do you ensure security in cloud deployments?"
    ],
    coding: [
      "Write Infrastructure as Code for cloud deployment.",
      "Configure cloud storage and database services."
    ],
    behavioral: [
      "Describe a cloud migration project you managed.",
      "How do you handle cloud cost optimization?"
    ]
  },

  qa: {
    technical: [
      "Explain the difference between manual and automated testing.",
      "What is test coverage and why does it matter?",
      "How do you prioritize which tests to automate?"
    ],
    coding: [
      "Write a test case for a login functionality.",
      "Create an automated test using Selenium or Cypress."
    ],
    behavioral: [
      "Describe a critical bug you discovered and how you reported it.",
      "How do you work with developers to resolve issues?"
    ]
  },

  "full stack": {
    technical: [
      "Design a 3-tier architecture for a web application.",
      "Explain how you optimize both frontend and backend performance.",
      "How do you manage state across frontend and backend?"
    ],
    coding: [
      "Build an API endpoint and its corresponding React component.",
      "Implement user authentication across the full stack."
    ],
    behavioral: [
      "Describe a full stack project you built independently.",
      "How do you balance frontend and backend work?"
    ]
  },

  general: {
    technical: [
      "What is REST API and how do you design one?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is time complexity and space complexity?"
    ],
    coding: [
      "Write a factorial function.",
      "Reverse an array without using extra space."
    ],
    behavioral: [
      "Tell me about yourself and your career journey.",
      "How do you approach learning new technologies?"
    ]
  }
};

export default mockQuestions;
