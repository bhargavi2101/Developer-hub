const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const SubTechnology = require('../models/SubTechnology');
require('dotenv').config();

// Comprehensive quiz data for all technology stacks
const quizData = {
  // Frontend Development
  'html-css': {
    title: 'HTML & CSS Fundamentals',
    description: 'Test your knowledge of HTML structure, CSS styling, and responsive design principles.',
    difficulty: 'beginner',
    timeLimit: 15,
    questions: [
      {
        question: 'Which HTML5 element is used to define the main content of a document?',
        type: 'multiple-choice',
        options: ['<main>', '<section>', '<article>', '<div>'],
        correctAnswer: 0,
        explanation: '<main> is specifically designed to contain the dominant content of the <body>.',
        points: 10
      },
      {
        question: 'What does CSS stand for?',
        type: 'multiple-choice',
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 0,
        explanation: 'CSS stands for Cascading Style Sheets, used to style HTML documents.',
        points: 10
      },
      {
        question: 'Which CSS property is used to change the background color of an element?',
        type: 'multiple-choice',
        options: ['background-color', 'color', 'bgcolor', 'background'],
        correctAnswer: 0,
        explanation: 'background-color property sets the background color of an element.',
        points: 10
      },
      {
        question: 'Flexbox is a one-dimensional layout system.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Flexbox is designed for one-dimensional layouts (either rows or columns), while Grid is for two-dimensional layouts.',
        points: 10
      },
      {
        question: 'What is the purpose of the alt attribute in an <img> tag?',
        type: 'multiple-choice',
        options: ['Alternative text for accessibility', 'Image title', 'Image source', 'Image alignment'],
        correctAnswer: 0,
        explanation: 'The alt attribute provides alternative text for screen readers and when images fail to load.',
        points: 10
      },
      {
        question: 'Which CSS unit is relative to the font size of the parent element?',
        type: 'multiple-choice',
        options: ['em', 'rem', 'px', 'vh'],
        correctAnswer: 0,
        explanation: 'em is relative to the parent element\'s font size, while rem is relative to the root element.',
        points: 10
      },
      {
        question: 'What is the CSS box model composed of?',
        type: 'multiple-choice',
        options: ['Content, Padding, Border, Margin', 'Content, Padding, Margin', 'Content, Border, Margin', 'Padding, Border, Margin'],
        correctAnswer: 0,
        explanation: 'The CSS box model consists of content, padding, border, and margin.',
        points: 10
      },
      {
        question: 'Media queries are used for responsive design.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Media queries allow applying different styles based on device characteristics like screen width.',
        points: 10
      },
      {
        question: 'Which CSS property controls the transparency of an element?',
        type: 'multiple-choice',
        options: ['opacity', 'transparent', 'visibility', 'display'],
        correctAnswer: 0,
        explanation: 'opacity property controls the transparency level (0 to 1) of an element.',
        points: 10
      },
      {
        question: 'What does semantic HTML improve?',
        type: 'multiple-choice',
        options: ['Accessibility and SEO', 'Page load speed', 'Browser compatibility', 'File size'],
        correctAnswer: 0,
        explanation: 'Semantic HTML improves accessibility for screen readers and SEO for search engines.',
        points: 10
      }
    ]
  },

  'javascript-typescript': {
    title: 'JavaScript & TypeScript',
    description: 'Test your understanding of JavaScript fundamentals and TypeScript type system.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is the output of typeof null in JavaScript?',
        type: 'multiple-choice',
        options: ['object', 'null', 'undefined', 'number'],
        correctAnswer: 0,
        explanation: 'typeof null returns "object" due to a historical bug in JavaScript.',
        points: 10
      },
      {
        question: 'Which keyword creates a block-scoped variable in JavaScript?',
        type: 'multiple-choice',
        options: ['let', 'var', 'global', 'window'],
        correctAnswer: 0,
        explanation: 'let and const create block-scoped variables, while var is function-scoped.',
        points: 10
      },
      {
        question: 'What is a closure in JavaScript?',
        type: 'multiple-choice',
        options: ['Function that has access to variables from its outer scope', 'A way to close browser windows', 'A method to end loops', 'A type of error handling'],
        correctAnswer: 0,
        explanation: 'A closure is a function that has access to variables from its outer (enclosing) scope.',
        points: 10
      },
      {
        question: 'TypeScript is a superset of JavaScript.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'TypeScript extends JavaScript by adding static types and other features.',
        points: 10
      },
      {
        question: 'What does the async keyword do in JavaScript?',
        type: 'multiple-choice',
        options: ['Marks a function as asynchronous', 'Makes code run faster', 'Creates a new thread', 'Prevents errors'],
        correctAnswer: 0,
        explanation: 'async marks a function as asynchronous, allowing use of await inside it.',
        points: 10
      },
      {
        question: 'Which method is used to convert JSON string to JavaScript object?',
        type: 'multiple-choice',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'],
        correctAnswer: 0,
        explanation: 'JSON.parse() converts a JSON string into a JavaScript object.',
        points: 10
      },
      {
        question: 'What is the difference between == and === in JavaScript?',
        type: 'multiple-choice',
        options: ['== checks value, === checks value and type', '== is faster than ===', '=== is for strings only', 'No difference'],
        correctAnswer: 0,
        explanation: '== performs type coercion, while === checks both value and type without coercion.',
        points: 10
      },
      {
        question: 'Promises can have three states: pending, fulfilled, and rejected.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'A Promise can be pending, fulfilled (resolved), or rejected.',
        points: 10
      },
      {
        question: 'What TypeScript type represents any value?',
        type: 'multiple-choice',
        options: ['any', 'unknown', 'all', 'every'],
        correctAnswer: 0,
        explanation: 'The any type represents any value and disables type checking.',
        points: 10
      },
      {
        question: 'Which array method creates a new array by applying a function to each element?',
        type: 'multiple-choice',
        options: ['map()', 'forEach()', 'filter()', 'reduce()'],
        correctAnswer: 0,
        explanation: 'map() creates a new array with results of calling a function on every element.',
        points: 10
      }
    ]
  },

  'angular-core': {
    title: 'Angular Core Concepts',
    description: 'Test your knowledge of Angular framework fundamentals and best practices.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is the purpose of @Component decorator in Angular?',
        type: 'multiple-choice',
        options: ['Defines a component class', 'Creates a service', 'Sets up routing', 'Manages state'],
        correctAnswer: 0,
        explanation: '@Component decorator marks a class as an Angular component and provides configuration metadata.',
        points: 10
      },
      {
        question: 'Which Angular module is required for reactive forms?',
        type: 'multiple-choice',
        options: ['ReactiveFormsModule', 'FormsModule', 'FormModule', 'NgFormModule'],
        correctAnswer: 0,
        explanation: 'ReactiveFormsModule provides reactive form directives like formControl and formGroup.',
        points: 10
      },
      {
        question: 'What is dependency injection in Angular?',
        type: 'multiple-choice',
        options: ['Design pattern for providing dependencies', 'A way to inject CSS', 'Database connection method', 'Testing framework'],
        correctAnswer: 0,
        explanation: 'Dependency injection is a design pattern where dependencies are provided to a class rather than created within it.',
        points: 10
      },
      {
        question: 'Angular uses two-way data binding by default.',
        type: 'true-false',
        options: ['False', 'True'],
        correctAnswer: 0,
        explanation: 'Angular uses one-way data binding by default. Two-way binding is achieved with [(ngModel)].',
        points: 10
      },
      {
        question: 'What is an Observable in Angular?',
        type: 'multiple-choice',
        options: ['A stream of values over time', 'A variable that can be observed', 'A database query', 'A CSS selector'],
        correctAnswer: 0,
        explanation: 'An Observable represents a stream of values that can be observed over time using RxJS.',
        points: 10
      },
      {
        question: 'Which lifecycle hook runs after Angular has fully initialized a component\'s view?',
        type: 'multiple-choice',
        options: ['ngAfterViewInit', 'ngOnInit', 'ngOnChanges', 'ngOnDestroy'],
        correctAnswer: 0,
        explanation: 'ngAfterViewInit runs after Angular initializes the component\'s view and child views.',
        points: 10
      },
      {
        question: 'What is the purpose of services in Angular?',
        type: 'multiple-choice',
        options: ['Share logic and data across components', 'Style components', 'Define routes', 'Handle animations'],
        correctAnswer: 0,
        explanation: 'Services are used to share business logic, data, and functionality across multiple components.',
        points: 10
      },
      {
        question: 'Pipes in Angular can transform data in templates.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Pipes transform displayed values within a template without changing the underlying data.',
        points: 10
      },
      {
        question: 'What is lazy loading in Angular?',
        type: 'multiple-choice',
        options: ['Loading modules on demand', 'Loading data slowly', 'Delayed initialization', 'Background processing'],
        correctAnswer: 0,
        explanation: 'Lazy loading loads feature modules only when they\'re needed, improving initial load time.',
        points: 10
      },
      {
        question: 'Which directive is used for conditional rendering in Angular?',
        type: 'multiple-choice',
        options: ['*ngIf', '*ngFor', '*ngSwitch', '*ngClass'],
        correctAnswer: 0,
        explanation: '*ngIf directive conditionally includes or excludes elements from the DOM.',
        points: 10
      }
    ]
  },

  'frontend-testing': {
    title: 'Frontend Testing',
    description: 'Test your knowledge of testing frontend applications with various testing frameworks.',
    difficulty: 'intermediate',
    timeLimit: 15,
    questions: [
      {
        question: 'What is unit testing?',
        type: 'multiple-choice',
        options: ['Testing individual functions/components', 'Testing the entire application', 'Testing user interactions', 'Testing database connections'],
        correctAnswer: 0,
        explanation: 'Unit testing focuses on testing individual units of code in isolation.',
        points: 10
      },
      {
        question: 'Which framework is commonly used for testing Angular applications?',
        type: 'multiple-choice',
        options: ['Jasmine', 'Mocha', 'Jest', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Jasmine, Mocha, and Jest can all be used for Angular testing, with Jasmine being the default.',
        points: 10
      },
      {
        question: 'What is end-to-end (E2E) testing?',
        type: 'multiple-choice',
        options: ['Testing the entire application flow', 'Testing individual functions', 'Testing API responses', 'Testing database queries'],
        correctAnswer: 0,
        explanation: 'E2E testing validates the entire application flow from start to finish.',
        points: 10
      },
      {
        question: 'Test doubles like mocks and stubs are used in unit testing.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Test doubles replace real dependencies to isolate units under test.',
        points: 10
      },
      {
        question: 'What is snapshot testing?',
        type: 'multiple-choice',
        options: ['Comparing rendered output to saved snapshots', 'Testing database snapshots', 'Testing memory usage', 'Testing network speed'],
        correctAnswer: 0,
        explanation: 'Snapshot testing compares rendered component output to previously saved snapshots.',
        points: 10
      },
      {
        question: 'What does TDD stand for?',
        type: 'multiple-choice',
        options: ['Test-Driven Development', 'Test-Data Design', 'Type-Driven Development', 'Team-Driven Development'],
        correctAnswer: 0,
        explanation: 'TDD stands for Test-Driven Development, where tests are written before implementation.',
        points: 10
      },
      {
        question: 'What is the purpose of beforeEach in testing?',
        type: 'multiple-choice',
        options: ['Run setup code before each test', 'Run cleanup code after each test', 'Define test groups', 'Skip certain tests'],
        correctAnswer: 0,
        explanation: 'beforeEach runs setup code before each individual test case.',
        points: 10
      },
      {
        question: 'Integration testing tests how different modules work together.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Integration testing validates that different modules or components work correctly together.',
        points: 10
      },
      {
        question: 'What is code coverage?',
        type: 'multiple-choice',
        options: ['Percentage of code executed by tests', 'Number of tests written', 'Time taken to run tests', 'Number of bugs found'],
        correctAnswer: 0,
        explanation: 'Code coverage measures how much of the codebase is executed during testing.',
        points: 10
      },
      {
        question: 'Which tool is commonly used for E2E testing in web applications?',
        type: 'multiple-choice',
        options: ['Cypress', 'Jest', 'Mocha', 'Chai'],
        correctAnswer: 0,
        explanation: 'Cypress is a popular E2E testing framework for web applications.',
        points: 10
      }
    ]
  },

  'performance-a11y': {
    title: 'Performance & Accessibility',
    description: 'Test your knowledge of web performance optimization and accessibility best practices.',
    difficulty: 'intermediate',
    timeLimit: 15,
    questions: [
      {
        question: 'What is the purpose of lazy loading images?',
        type: 'multiple-choice',
        options: ['Load images only when needed', 'Compress images', 'Convert image formats', 'Add watermarks'],
        correctAnswer: 0,
        explanation: 'Lazy loading defers loading of images until they\'re needed, improving initial page load.',
        points: 10
      },
      {
        question: 'What does ARIA stand for?',
        type: 'multiple-choice',
        options: ['Accessible Rich Internet Applications', 'Automated Resource Integration Architecture', 'Advanced React Internet Applications', 'Accessibility Requirements Interface Application'],
        correctAnswer: 0,
        explanation: 'ARIA stands for Accessible Rich Internet Applications, providing accessibility attributes.',
        points: 10
      },
      {
        question: 'What is the purpose of the alt attribute on images for accessibility?',
        type: 'multiple-choice',
        options: ['Provide alternative text for screen readers', 'Add tooltips', 'Improve SEO only', 'Style the image'],
        correctAnswer: 0,
        explanation: 'The alt attribute provides alternative text for screen readers and when images fail to load.',
        points: 10
      },
      {
        question: 'Minification reduces file size by removing unnecessary characters.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Minification removes whitespace, comments, and other unnecessary characters to reduce file size.',
        points: 10
      },
      {
        question: 'What is Critical CSS?',
        type: 'multiple-choice',
        options: ['CSS needed for above-the-fold content', 'CSS for critical errors', 'CSS for mobile devices', 'CSS for animations'],
        correctAnswer: 0,
        explanation: 'Critical CSS contains only the styles needed for the initially visible portion of a page.',
        points: 10
      },
      {
        question: 'What is the purpose of ARIA landmarks?',
        type: 'multiple-choice',
        options: ['Identify regions of the page for screen readers', 'Add visual markers', 'Create navigation menus', 'Style sections'],
        correctAnswer: 0,
        explanation: 'ARIA landmarks help screen reader users navigate to different sections of a page.',
        points: 10
      },
      {
        question: 'What is the purpose of a service worker?',
        type: 'multiple-choice',
        options: ['Enable offline functionality and caching', 'Style web pages', 'Connect to databases', 'Handle form submissions'],
        correctAnswer: 0,
        explanation: 'Service workers enable offline functionality, push notifications, and background sync.',
        points: 10
      },
      {
        question: 'Keyboard navigation is important for accessibility.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Keyboard navigation ensures users who can\'t use a mouse can still navigate the interface.',
        points: 10
      },
      {
        question: 'What does the Lighthouse tool measure?',
        type: 'multiple-choice',
        options: ['Performance, accessibility, SEO, and best practices', 'Only performance', 'Only accessibility', 'Only SEO'],
        correctAnswer: 0,
        explanation: 'Lighthouse measures performance, accessibility, SEO, and best practices for web pages.',
        points: 10
      },
      {
        question: 'What is the purpose of color contrast in accessibility?',
        type: 'multiple-choice',
        options: ['Ensure text is readable for people with visual impairments', 'Make pages look better', 'Improve performance', 'Reduce file size'],
        correctAnswer: 0,
        explanation: 'Proper color contrast ensures text is readable for users with visual impairments.',
        points: 10
      }
    ]
  },

  // Backend Development
  'java-spring': {
    title: 'Java & Spring Framework',
    description: 'Test your knowledge of Java programming and Spring Boot framework.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is Spring Boot?',
        type: 'multiple-choice',
        options: ['Framework for creating stand-alone Spring applications', 'Java IDE', 'Build tool', 'Database'],
        correctAnswer: 0,
        explanation: 'Spring Boot simplifies creating stand-alone, production-grade Spring applications.',
        points: 10
      },
      {
        question: 'What annotation is used to define a REST controller in Spring?',
        type: 'multiple-choice',
        options: ['@RestController', '@Controller', '@RequestMapping', '@Endpoint'],
        correctAnswer: 0,
        explanation: '@RestController combines @Controller and @ResponseBody for RESTful web services.',
        points: 10
      },
      {
        question: 'What is dependency injection in Spring?',
        type: 'multiple-choice',
        options: ['Inversion of Control pattern for managing dependencies', 'Database connection pooling', 'Security mechanism', 'Caching strategy'],
        correctAnswer: 0,
        explanation: 'Dependency injection is an IoC pattern where Spring manages object dependencies.',
        points: 10
      },
      {
        question: 'Spring Boot uses convention over configuration.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Spring Boot follows convention over configuration, reducing boilerplate code.',
        points: 10
      },
      {
        question: 'What is the purpose of @Autowired annotation?',
        type: 'multiple-choice',
        options: ['Automatically wire dependencies', 'Create database connections', 'Define REST endpoints', 'Handle exceptions'],
        correctAnswer: 0,
        explanation: '@Autowired tells Spring to automatically wire dependencies into a bean.',
        points: 10
      },
      {
        question: 'What is Spring Data JPA?',
        type: 'multiple-choice',
        options: ['ORM framework for database operations', 'JSON processing library', 'Security framework', 'Testing framework'],
        correctAnswer: 0,
        explanation: 'Spring Data JPA provides repository support for JPA persistence technologies.',
        points: 10
      },
      {
        question: 'What is the purpose of @Service annotation?',
        type: 'multiple-choice',
        options: ['Indicate a service layer component', 'Create REST endpoints', 'Define database entities', 'Handle web requests'],
        correctAnswer: 0,
        explanation: '@Service indicates a class that contains business logic in the service layer.',
        points: 10
      },
      {
        question: 'Spring Security can be used for authentication and authorization.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Spring Security provides comprehensive authentication and authorization for Java applications.',
        points: 10
      },
      {
        question: 'What is a bean in Spring?',
        type: 'multiple-choice',
        options: ['An object managed by Spring container', 'A Java class', 'A database table', 'A configuration file'],
        correctAnswer: 0,
        explanation: 'A bean is an object that is instantiated, assembled, and managed by the Spring container.',
        points: 10
      },
      {
        question: 'What is the purpose of @Transactional annotation?',
        type: 'multiple-choice',
        options: ['Define transaction boundaries for database operations', 'Create REST transactions', 'Handle HTTP transactions', 'Manage web sessions'],
        correctAnswer: 0,
        explanation: '@Transactional defines transaction boundaries for database operations, ensuring atomicity.',
        points: 10
      }
    ]
  },

  'dotnet-core': {
    title: '.NET Core Development',
    description: 'Test your knowledge of .NET Core framework and C# programming.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is .NET Core?',
        type: 'multiple-choice',
        options: ['Cross-platform development framework', 'Windows-only framework', 'Database system', 'JavaScript framework'],
        correctAnswer: 0,
        explanation: '.NET Core is a cross-platform, open-source development framework.',
        points: 10
      },
      {
        question: 'What is the entry point of a .NET Core application?',
        type: 'multiple-choice',
        options: ['Main method', 'Start method', 'Init method', 'Run method'],
        correctAnswer: 0,
        explanation: 'The Main method is the entry point where program execution begins.',
        points: 10
      },
      {
        question: 'What is dependency injection in .NET Core?',
        type: 'multiple-choice',
        options: ['Built-in IoC container for managing dependencies', 'Database connection tool', 'Security feature', 'Caching mechanism'],
        correctAnswer: 0,
        explanation: '.NET Core has built-in dependency injection through its IoC container.',
        points: 10
      },
      {
        question: '.NET Core supports multiple programming languages.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: '.NET Core supports C#, F#, Visual Basic, and other languages.',
        points: 10
      },
      {
        question: 'What is ASP.NET Core?',
        type: 'multiple-choice',
        options: ['Web framework for building web apps', 'Desktop framework', 'Mobile framework', 'Game framework'],
        correctAnswer: 0,
        explanation: 'ASP.NET Core is a cross-platform web framework for building modern web applications.',
        points: 10
      },
      {
        question: 'What is the purpose of Entity Framework Core?',
        type: 'multiple-choice',
        options: ['ORM for database operations', 'Web framework', 'Security library', 'Testing framework'],
        correctAnswer: 0,
        explanation: 'Entity Framework Core is an ORM for database operations in .NET applications.',
        points: 10
      },
      {
        question: 'What is middleware in ASP.NET Core?',
        type: 'multiple-choice',
        options: ['Software components in the request pipeline', 'Database software', 'Security tools', 'Build tools'],
        correctAnswer: 0,
        explanation: 'Middleware components form the request processing pipeline in ASP.NET Core.',
        points: 10
      },
      {
        question: 'C# is a statically typed language.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'C# is statically typed, meaning variable types are known at compile time.',
        points: 10
      },
      {
        question: 'What is the purpose of the async and await keywords in C#?',
        type: 'multiple-choice',
        options: ['Write asynchronous code more easily', 'Make code run faster', 'Create threads', 'Handle exceptions'],
        correctAnswer: 0,
        explanation: 'async and await simplify writing asynchronous code without callback hell.',
        points: 10
      },
      {
        question: 'What is NuGet?',
        type: 'multiple-choice',
        options: ['Package manager for .NET', 'IDE for .NET', 'Build tool', 'Testing framework'],
        correctAnswer: 0,
        explanation: 'NuGet is the package manager for .NET, used to manage dependencies.',
        points: 10
      }
    ]
  },

  'python-backend': {
    title: 'Python Backend Development',
    description: 'Test your knowledge of Python programming for backend development.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is Flask?',
        type: 'multiple-choice',
        options: ['Lightweight web framework', 'Full-stack framework', 'Database system', 'Testing tool'],
        correctAnswer: 0,
        explanation: 'Flask is a lightweight WSGI web application framework.',
        points: 10
      },
      {
        question: 'What is Django?',
        type: 'multiple-choice',
        options: ['Full-featured web framework', 'Micro-framework', 'Database ORM only', 'Template engine'],
        correctAnswer: 0,
        explanation: 'Django is a high-level Python web framework with many built-in features.',
        points: 10
      },
      {
        question: 'What is a decorator in Python?',
        type: 'multiple-choice',
        options: ['Function that modifies another function', 'Database decorator', 'Class decorator', 'HTML decorator'],
        correctAnswer: 0,
        explanation: 'Decorators are functions that modify the behavior of other functions or methods.',
        points: 10
      },
      {
        question: 'Python uses indentation to define code blocks.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Python uses whitespace indentation to define code blocks instead of braces.',
        points: 10
      },
      {
        question: 'What is the purpose of the GIL in Python?',
        type: 'multiple-choice',
        options: ['Global Interpreter Lock for thread safety', 'Graphic Interface Library', 'Global Internet Lock', 'General Import Library'],
        correctAnswer: 0,
        explanation: 'The GIL ensures only one thread executes Python bytecode at a time.',
        points: 10
      },
      {
        question: 'What is SQLAlchemy?',
        type: 'multiple-choice',
        options: ['SQL toolkit and ORM', 'Web framework', 'Testing framework', 'API framework'],
        correctAnswer: 0,
        explanation: 'SQLAlchemy is a SQL toolkit and Object-Relational Mapping (ORM) library.',
        points: 10
      },
      {
        question: 'What is a virtual environment in Python?',
        type: 'multiple-choice',
        options: ['Isolated Python environment for projects', 'Virtual machine', 'Cloud environment', 'Testing environment'],
        correctAnswer: 0,
        explanation: 'Virtual environments create isolated Python environments with their own dependencies.',
        points: 10
      },
      {
        question: 'FastAPI is a modern, fast web framework for building APIs.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'FastAPI is a modern, fast web framework for building APIs with Python.',
        points: 10
      },
      {
        question: 'What is the purpose of pip in Python?',
        type: 'multiple-choice',
        options: ['Package manager', 'Code formatter', 'Testing tool', 'Documentation generator'],
        correctAnswer: 0,
        explanation: 'pip is Python\'s package installer and manager.',
        points: 10
      },
      {
        question: 'What is a context manager in Python?',
        type: 'multiple-choice',
        options: ['Manages resources using with statement', 'Manages database connections only', 'Manages user sessions', 'Manages file permissions'],
        correctAnswer: 0,
        explanation: 'Context managers manage resources using the with statement for proper cleanup.',
        points: 10
      }
    ]
  },

  'node-express': {
    title: 'Node.js & Express',
    description: 'Test your knowledge of Node.js runtime and Express framework.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is Node.js?',
        type: 'multiple-choice',
        options: ['JavaScript runtime for server-side code', 'JavaScript library', 'Database system', 'Build tool'],
        correctAnswer: 0,
        explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine for server-side code.',
        points: 10
      },
      {
        question: 'What is npm?',
        type: 'multiple-choice',
        options: ['Node package manager', 'Node programming language', 'Node debugger', 'Node testing tool'],
        correctAnswer: 0,
        explanation: 'npm is the package manager for Node.js and JavaScript.',
        points: 10
      },
      {
        question: 'What is Express.js?',
        type: 'multiple-choice',
        options: ['Web application framework for Node.js', 'Database ORM', 'Testing framework', 'Build tool'],
        correctAnswer: 0,
        explanation: 'Express.js is a minimal and flexible Node.js web application framework.',
        points: 10
      },
      {
        question: 'Node.js uses a single-threaded event loop.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Node.js uses an event-driven, non-blocking I/O model with a single-threaded event loop.',
        points: 10
      },
      {
        question: 'What is middleware in Express?',
        type: 'multiple-choice',
        options: ['Functions that have access to request and response objects', 'Database middleware', 'Security software', 'Load balancer'],
        correctAnswer: 0,
        explanation: 'Middleware functions have access to req, res, and next in the request-response cycle.',
        points: 10
      },
      {
        question: 'What is the purpose of require() in Node.js?',
        type: 'multiple-choice',
        options: ['Import modules', 'Export modules', 'Create modules', 'Delete modules'],
        correctAnswer: 0,
        explanation: 'require() is used to import modules in Node.js CommonJS system.',
        points: 10
      },
      {
        question: 'What is RESTful API design?',
        type: 'multiple-choice',
        options: ['API design using HTTP methods and resources', 'Database design', 'UI design', 'Security design'],
        correctAnswer: 0,
        explanation: 'RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) to operate on resources.',
        points: 10
      },
      {
        question: 'Promises in JavaScript are used for asynchronous operations.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Promises represent the eventual completion or failure of asynchronous operations.',
        points: 10
      },
      {
        question: 'What is MongoDB?',
        type: 'multiple-choice',
        options: ['NoSQL database', 'SQL database', 'ORM tool', 'Cache system'],
        correctAnswer: 0,
        explanation: 'MongoDB is a popular NoSQL document database.',
        points: 10
      },
      {
        question: 'What is the purpose of body-parser in Express?',
        type: 'multiple-choice',
        options: ['Parse incoming request bodies', 'Parse HTML responses', 'Parse database queries', 'Parse URLs'],
        correctAnswer: 0,
        explanation: 'body-parser parses incoming request bodies in a middleware before your handlers.',
        points: 10
      }
    ]
  },

  // Database & Security (adding a few key ones)
  'database-modeling': {
    title: 'Database Modeling',
    description: 'Test your knowledge of database design and data modeling principles.',
    difficulty: 'intermediate',
    timeLimit: 15,
    questions: [
      {
        question: 'What is a primary key in a database?',
        type: 'multiple-choice',
        options: ['Unique identifier for each record', 'Foreign key reference', 'Index field', 'Data type'],
        correctAnswer: 0,
        explanation: 'A primary key uniquely identifies each record in a database table.',
        points: 10
      },
      {
        question: 'What is normalization in database design?',
        type: 'multiple-choice',
        options: ['Process of organizing data to reduce redundancy', 'Creating backups', 'Encrypting data', 'Creating indexes'],
        correctAnswer: 0,
        explanation: 'Normalization reduces data redundancy and improves data integrity.',
        points: 10
      },
      {
        question: 'What is a foreign key?',
        type: 'multiple-choice',
        options: ['Field that links to another table\'s primary key', 'Primary key in another language', 'Security key', 'Index key'],
        correctAnswer: 0,
        explanation: 'A foreign key establishes a relationship between tables by referencing a primary key.',
        points: 10
      },
      {
        question: 'NoSQL databases do not use SQL for queries.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'NoSQL databases use various query languages but typically not standard SQL.',
        points: 10
      },
      {
        question: 'What is the difference between SQL and NoSQL databases?',
        type: 'multiple-choice',
        options: ['SQL uses structured tables, NoSQL uses flexible schemas', 'SQL is faster', 'NoSQL is more secure', 'No specific difference'],
        correctAnswer: 0,
        explanation: 'SQL databases use rigid table structures, while NoSQL databases offer flexible schemas.',
        points: 10
      },
      {
        question: 'What is an index in a database?',
        type: 'multiple-choice',
        options: ['Data structure that improves query performance', 'Primary key', 'Foreign key', 'Backup copy'],
        correctAnswer: 0,
        explanation: 'Indexes improve the speed of data retrieval operations on database tables.',
        points: 10
      },
      {
        question: 'What is a relationship in database design?',
        type: 'multiple-choice',
        options: ['Association between tables', 'Table name', 'Column name', 'Data type'],
        correctAnswer: 0,
        explanation: 'Relationships define how tables are related to each other (one-to-one, one-to-many, many-to-many).',
        points: 10
      },
      {
        question: 'MongoDB stores data in BSON format.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'MongoDB stores data in BSON (Binary JSON) format.',
        points: 10
      },
      {
        question: 'What is ACID in database transactions?',
        type: 'multiple-choice',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Create, Insert, Delete', 'Automated, Centralized, Integrated, Distributed', 'Active, Concurrent, Isolated, Distributed'],
        correctAnswer: 0,
        explanation: 'ACID properties ensure reliable database transactions.',
        points: 10
      },
      {
        question: 'What is denormalization?',
        type: 'multiple-choice',
        options: ['Intentionally adding redundancy for performance', 'Removing all indexes', 'Creating backups', 'Encrypting data'],
        correctAnswer: 0,
        explanation: 'Denormalization adds controlled redundancy to improve read performance.',
        points: 10
      }
    ]
  },

  'auth-security': {
    title: 'Authentication & Security',
    description: 'Test your knowledge of authentication mechanisms and security best practices.',
    difficulty: 'advanced',
    timeLimit: 20,
    questions: [
      {
        question: 'What is JWT?',
        type: 'multiple-choice',
        options: ['JSON Web Token for authentication', 'Java Web Tool', 'JSON Web Template', 'JavaScript Web Tester'],
        correctAnswer: 0,
        explanation: 'JWT is a compact, URL-safe means of representing claims to be transferred between parties.',
        points: 10
      },
      {
        question: 'What is the difference between authentication and authorization?',
        type: 'multiple-choice',
        options: ['Authentication verifies identity, authorization grants permissions', 'No difference', 'Authorization verifies identity, authentication grants permissions', 'Both are the same'],
        correctAnswer: 0,
        explanation: 'Authentication verifies who you are, authorization determines what you can do.',
        points: 10
      },
      {
        question: 'What is OAuth?',
        type: 'multiple-choice',
        options: ['Authorization framework', 'Authentication protocol only', 'Database system', 'Encryption method'],
        correctAnswer: 0,
        explanation: 'OAuth is an authorization framework for granting access to resources.',
        points: 10
      },
      {
        question: 'HTTPS encrypts data in transit.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'HTTPS uses SSL/TLS to encrypt data between client and server.',
        points: 10
      },
      {
        question: 'What is SQL injection?',
        type: 'multiple-choice',
        options: ['Code injection attack via SQL queries', 'Database optimization technique', 'SQL backup method', 'Database migration tool'],
        correctAnswer: 0,
        explanation: 'SQL injection is a code injection technique that exploits vulnerabilities in database queries.',
        points: 10
      },
      {
        question: 'What is XSS (Cross-Site Scripting)?',
        type: 'multiple-choice',
        options: ['Client-side code injection attack', 'Server-side attack', 'Database attack', 'Network attack'],
        correctAnswer: 0,
        explanation: 'XSS injects malicious scripts into web pages viewed by other users.',
        points: 10
      },
      {
        question: 'What is CSRF (Cross-Site Request Forgery)?',
        type: 'multiple-choice',
        options: ['Attack that forces users to execute unwanted actions', 'Server-side attack', 'Database attack', 'Authentication bypass'],
        correctAnswer: 0,
        explanation: 'CSRF tricks users into executing unwanted actions on a web application where they\'re authenticated.',
        points: 10
      },
      {
        question: 'Password hashing should be used instead of storing plain text passwords.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Passwords should always be hashed using algorithms like bcrypt, never stored in plain text.',
        points: 10
      },
      {
        question: 'What is the purpose of a salt in password hashing?',
        type: 'multiple-choice',
        options: ['Add random data to prevent rainbow table attacks', 'Add flavor to passwords', 'Encrypt passwords', 'Compress passwords'],
        correctAnswer: 0,
        explanation: 'Salts add random data to passwords before hashing to prevent rainbow table attacks.',
        points: 10
      },
      {
        question: 'What is CORS?',
        type: 'multiple-choice',
        options: ['Cross-Origin Resource Sharing mechanism', 'Cross-Origin Request Security', 'Client-Origin Resource System', 'Centralized Origin Request System'],
        correctAnswer: 0,
        explanation: 'CORS is a mechanism that allows restricted resources on a web page to be requested from another domain.',
        points: 10
      }
    ]
  },

  // DevOps
  'docker': {
    title: 'Docker Containers',
    description: 'Test your knowledge of Docker containerization and container management.',
    difficulty: 'intermediate',
    timeLimit: 15,
    questions: [
      {
        question: 'What is Docker?',
        type: 'multiple-choice',
        options: ['Platform for containerizing applications', 'Virtual machine', 'Cloud provider', 'Database system'],
        correctAnswer: 0,
        explanation: 'Docker is a platform for developing, shipping, and running applications in containers.',
        points: 10
      },
      {
        question: 'What is a Docker image?',
        type: 'multiple-choice',
        options: ['Read-only template for containers', 'Running container', 'Database backup', 'Configuration file'],
        correctAnswer: 0,
        explanation: 'A Docker image is a read-only template used to create containers.',
        points: 10
      },
      {
        question: 'What is the difference between a container and a VM?',
        type: 'multiple-choice',
        options: ['Containers share the host OS, VMs have separate OS', 'No difference', 'VMs are faster', 'Containers are more secure'],
        correctAnswer: 0,
        explanation: 'Containers share the host OS kernel, while VMs have their own guest OS.',
        points: 10
      },
      {
        question: 'Docker Compose is used for defining and running multi-container applications.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Docker Compose defines and runs multi-container Docker applications.',
        points: 10
      },
      {
        question: 'What is a Dockerfile?',
        type: 'multiple-choice',
        options: ['Script to build Docker images', 'Configuration for Docker Compose', 'Docker image file', 'Container log file'],
        correctAnswer: 0,
        explanation: 'A Dockerfile contains instructions to build a Docker image.',
        points: 10
      },
      {
        question: 'What is the purpose of Docker volumes?',
        type: 'multiple-choice',
        options: ['Persist data outside containers', 'Increase container size', 'Backup containers', 'Share images'],
        correctAnswer: 0,
        explanation: 'Volumes persist data and share it between containers and the host system.',
        points: 10
      },
      {
        question: 'What is Docker Hub?',
        type: 'multiple-choice',
        options: ['Cloud registry for Docker images', 'Container orchestration tool', 'Monitoring tool', 'CI/CD platform'],
        correctAnswer: 0,
        explanation: 'Docker Hub is a cloud-based registry for Docker images.',
        points: 10
      },
      {
        question: 'Containers are more lightweight than virtual machines.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Containers share the host OS, making them much lighter than VMs.',
        points: 10
      },
      {
        question: 'What command is used to run a Docker container?',
        type: 'multiple-choice',
        options: ['docker run', 'docker start', 'docker create', 'docker execute'],
        correctAnswer: 0,
        explanation: 'docker run creates and starts a new container from an image.',
        points: 10
      },
      {
        question: 'What is the purpose of .dockerignore file?',
        type: 'multiple-choice',
        options: ['Exclude files from Docker build context', 'Ignore Docker errors', 'Configure Docker daemon', 'Set environment variables'],
        correctAnswer: 0,
        explanation: '.dockerignore specifies files to exclude from the Docker build context.',
        points: 10
      }
    ]
  },

  'kubernetes': {
    title: 'Kubernetes Orchestration',
    description: 'Test your knowledge of Kubernetes container orchestration.',
    difficulty: 'advanced',
    timeLimit: 20,
    questions: [
      {
        question: 'What is Kubernetes?',
        type: 'multiple-choice',
        options: ['Container orchestration platform', 'Container runtime', 'Docker alternative', 'Cloud provider'],
        correctAnswer: 0,
        explanation: 'Kubernetes is an open-source container orchestration platform.',
        points: 10
      },
      {
        question: 'What is a Pod in Kubernetes?',
        type: 'multiple-choice',
        options: ['Smallest deployable unit in Kubernetes', 'Container image', 'Network policy', 'Storage volume'],
        correctAnswer: 0,
        explanation: 'A Pod is the smallest deployable unit in Kubernetes, containing one or more containers.',
        points: 10
      },
      {
        question: 'What is a Kubernetes Deployment?',
        type: 'multiple-choice',
        options: ['Manages Pod replicas and updates', 'Network configuration', 'Storage management', 'Security policy'],
        correctAnswer: 0,
        explanation: 'Deployments manage Pod replicas and provide declarative updates to Pods.',
        points: 10
      },
      {
        question: 'Kubernetes can automatically scale applications based on load.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Kubernetes supports horizontal pod autoscaling based on CPU/memory usage.',
        points: 10
      },
      {
        question: 'What is a Service in Kubernetes?',
        type: 'multiple-choice',
        options: ['Network abstraction for Pods', 'Storage abstraction', 'Configuration abstraction', 'Security abstraction'],
        correctAnswer: 0,
        explanation: 'A Service provides network access to a set of Pods.',
        points: 10
      },
      {
        question: 'What is a ConfigMap in Kubernetes?',
        type: 'multiple-choice',
        options: ['Store configuration data', 'Store secrets', 'Define network policies', 'Manage storage'],
        correctAnswer: 0,
        explanation: 'ConfigMaps store configuration data as key-value pairs.',
        points: 10
      },
      {
        question: 'What is the difference between a ConfigMap and a Secret?',
        type: 'multiple-choice',
        options: ['Secrets are for sensitive data, ConfigMaps for configuration', 'No difference', 'ConfigMaps are encrypted', 'Secrets are larger'],
        correctAnswer: 0,
        explanation: 'Secrets are used for sensitive data like passwords, ConfigMaps for general configuration.',
        points: 10
      },
      {
        question: 'Kubernetes uses YAML files for configuration.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Kubernetes commonly uses YAML files for resource configuration.',
        points: 10
      },
      {
        question: 'What is a Namespace in Kubernetes?',
        type: 'multiple-choice',
        options: ['Virtual cluster within a cluster', 'Physical cluster', 'Network segment', 'Storage partition'],
        correctAnswer: 0,
        explanation: 'Namespaces provide a way to divide cluster resources between multiple users.',
        points: 10
      },
      {
        question: 'What is the purpose of an Ingress in Kubernetes?',
        type: 'multiple-choice',
        options: ['Manage external access to Services', 'Internal networking', 'Storage management', 'Security policies'],
        correctAnswer: 0,
        explanation: 'Ingress manages external access to Services, typically HTTP/HTTPS.',
        points: 10
      }
    ]
  },

  // Mobile Development
  'flutter': {
    title: 'Flutter Development',
    description: 'Test your knowledge of Flutter cross-platform mobile development.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is Flutter?',
        type: 'multiple-choice',
        options: ['UI toolkit for building natively compiled apps', 'Mobile game engine', 'Database system', 'Testing framework'],
        correctAnswer: 0,
        explanation: 'Flutter is Google\'s UI toolkit for building natively compiled applications.',
        points: 10
      },
      {
        question: 'What programming language does Flutter use?',
        type: 'multiple-choice',
        options: ['Dart', 'Swift', 'Kotlin', 'JavaScript'],
        correctAnswer: 0,
        explanation: 'Flutter uses the Dart programming language.',
        points: 10
      },
      {
        question: 'What is a Widget in Flutter?',
        type: 'multiple-choice',
        options: ['Building block for UI', 'Database widget', 'Network widget', 'Security widget'],
        correctAnswer: 0,
        explanation: 'Everything in Flutter is a widget, which are the building blocks of the UI.',
        points: 10
      },
      {
        question: 'Flutter apps can run on both iOS and Android from a single codebase.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Flutter is cross-platform, allowing single codebase deployment to iOS and Android.',
        points: 10
      },
      {
        question: 'What is the purpose of the build method in Flutter?',
        type: 'multiple-choice',
        options: ['Describe the UI', 'Initialize the app', 'Handle user input', 'Manage state'],
        correctAnswer: 0,
        explanation: 'The build method describes the UI in terms of other lower-level widgets.',
        points: 10
      },
      {
        question: 'What is a StatefulWidget in Flutter?',
        type: 'multiple-choice',
        options: ['Widget that can change over time', 'Static widget', 'Layout widget', 'Navigation widget'],
        correctAnswer: 0,
        explanation: 'StatefulWidget widgets can change state and rebuild their UI.',
        points: 10
      },
      {
        question: 'What is pubspec.yaml in Flutter?',
        type: 'multiple-choice',
        options: ['Project configuration and dependencies file', 'Code file', 'Resource file', 'Build file'],
        correctAnswer: 0,
        explanation: 'pubspec.yaml contains project metadata and dependencies.',
        points: 10
      },
      {
        question: 'Hot reload allows you to see changes instantly without restarting the app.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Hot reload injects updated source code into the running Dart VM.',
        points: 10
      },
      {
        question: 'What is the difference between StatelessWidget and StatefulWidget?',
        type: 'multiple-choice',
        options: ['StatelessWidget is immutable, StatefulWidget can change', 'No difference', 'StatelessWidget is faster', 'StatefulWidget is for layouts only'],
        correctAnswer: 0,
        explanation: 'StatelessWidget is immutable, while StatefulWidget can maintain state and change over time.',
        points: 10
      },
      {
        question: 'What is the purpose of packages in Flutter?',
        type: 'multiple-choice',
        options: ['Reusable code and libraries', 'UI components only', 'Database connections', 'Network requests only'],
        correctAnswer: 0,
        explanation: 'Packages are reusable libraries that extend Flutter functionality.',
        points: 10
      }
    ]
  },

  'react-native': {
    title: 'React Native Development',
    description: 'Test your knowledge of React Native cross-platform mobile development.',
    difficulty: 'intermediate',
    timeLimit: 20,
    questions: [
      {
        question: 'What is React Native?',
        type: 'multiple-choice',
        options: ['Framework for building native mobile apps with React', 'React for web only', 'Mobile web framework', 'Game engine'],
        correctAnswer: 0,
        explanation: 'React Native lets you build native mobile apps using React.',
        points: 10
      },
      {
        question: 'What programming language does React Native use?',
        type: 'multiple-choice',
        options: ['JavaScript', 'Swift', 'Kotlin', 'Java'],
        correctAnswer: 0,
        explanation: 'React Native uses JavaScript, though you can also use TypeScript.',
        points: 10
      },
      {
        question: 'What is a Component in React Native?',
        type: 'multiple-choice',
        options: ['Building block of UI', 'Database component', 'Network component', 'Security component'],
        correctAnswer: 0,
        explanation: 'Components are the building blocks of React Native applications.',
        points: 10
      },
      {
        question: 'React Native compiles to native code.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'React Native components compile to native platform components.',
        points: 10
      },
      {
        question: 'What is the purpose of StyleSheet in React Native?',
        type: 'multiple-choice',
        options: ['Define component styles', 'Create stylesheets only', 'Handle styles from CSS files', 'Import external styles'],
        correctAnswer: 0,
        explanation: 'StyleSheet creates an optimized style object for components.',
        points: 10
      },
      {
        question: 'What is the difference between React and React Native?',
        type: 'multiple-choice',
        options: ['React uses HTML elements, React Native uses native components', 'No difference', 'React Native is faster', 'React is for mobile only'],
        correctAnswer: 0,
        explanation: 'React uses web HTML elements, while React Native uses platform-specific native components.',
        points: 10
      },
      {
        question: 'What is props in React Native?',
        type: 'multiple-choice',
        options: ['Properties passed to components', 'Component state', 'Styles', 'Events'],
        correctAnswer: 0,
        explanation: 'Props are properties passed from parent to child components.',
        points: 10
      },
      {
        question: 'React Native supports hot reloading during development.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'React Native supports hot reloading for faster development.',
        points: 10
      },
      {
        question: 'What is the purpose of useState hook in React Native?',
        type: 'multiple-choice',
        options: ['Manage component state', 'Handle side effects', 'Manage context', 'Handle refs'],
        correctAnswer: 0,
        explanation: 'useState adds state management to functional components.',
        points: 10
      },
      {
        question: 'What is the purpose of useEffect hook in React Native?',
        type: 'multiple-choice',
        options: ['Handle side effects in functional components', 'Manage state', 'Create components', 'Handle navigation'],
        correctAnswer: 0,
        explanation: 'useEffect handles side effects like data fetching, subscriptions, and DOM manipulation.',
        points: 10
      }
    ]
  }
};

async function seedQuizzes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing quizzes (optional, comment out if you want to keep existing ones)
    await Quiz.deleteMany({});
    console.log('🗑️ Cleared existing quizzes');

    let createdQuizzes = 0;
    let failedQuizzes = [];

    // Create quizzes for each technology
    for (const [subTechnologyId, quizInfo] of Object.entries(quizData)) {
      try {
        // Check if subtechnology exists
        const subTechnology = await SubTechnology.findOne({ slug: subTechnologyId });

        if (!subTechnology) {
          console.log(`⚠️ SubTechnology not found: ${subTechnologyId} - creating quiz with ID reference`);

          // Create quiz without subTechnology reference
          const quiz = new Quiz({
            subTechnologyId: subTechnologyId,
            ...quizInfo,
            isActive: true
          });

          await quiz.save();
          console.log(`✅ Created quiz for: ${quizInfo.title}`);
          createdQuizzes++;
          continue;
        }

        // Create quiz with proper subTechnology reference
        const quiz = new Quiz({
          subTechnologyId: subTechnology._id.toString(),
          ...quizInfo,
          isActive: true
        });

        await quiz.save();
        console.log(`✅ Created quiz for: ${quizInfo.title}`);
        createdQuizzes++;

        // Update subTechnology to include this quiz
        await SubTechnology.findByIdAndUpdate(
          subTechnology._id,
          { $push: { quizzes: quiz._id } }
        );

      } catch (error) {
        console.error(`❌ Failed to create quiz for ${subTechnologyId}:`, error.message);
        failedQuizzes.push({ id: subTechnologyId, error: error.message });
      }
    }

    console.log('\n📊 Quiz Seeding Summary:');
    console.log(`✅ Successfully created: ${createdQuizzes} quizzes`);

    if (failedQuizzes.length > 0) {
      console.log(`❌ Failed to create: ${failedQuizzes.length} quizzes`);
      failedQuizzes.forEach(({ id, error }) => {
        console.log(`   - ${id}: ${error}`);
      });
    }

    console.log('\n🎉 Quiz seeding completed!');

    // Display some quiz statistics
    const totalQuizzes = await Quiz.countDocuments();
    const activeQuizzes = await Quiz.countDocuments({ isActive: true });

    console.log(`\n📈 Database Statistics:`);
    console.log(`   Total quizzes: ${totalQuizzes}`);
    console.log(`   Active quizzes: ${activeQuizzes}`);

    // List all quizzes by difficulty
    const quizzesByDifficulty = await Quiz.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    console.log(`   By difficulty:`);
    quizzesByDifficulty.forEach(({ _id, count }) => {
      console.log(`   - ${_id}: ${count} quizzes`);
    });

  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
seedQuizzes();
