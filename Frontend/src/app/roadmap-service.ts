import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ExperienceLevel = 'Fresher' | 'Experienced';

export interface VideoResource {
  title: string;
  channel: string;
  url: string;
}

export interface SubTechnology {
  id: string;
  title: string;
  description: string;
  whatYouWillLearn: string[];
  videos: VideoResource[];
  completed?: boolean;
  detailedContent?: DetailedContent;
}

export interface DetailedContent {
  overview: string;
  prerequisites: string[];
  topics: ModuleTopic[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyConcepts: string[];
  practicalProjects: Project[];
  resources: AdditionalResource[];
}

export interface ModuleTopic {
  title: string;
  description: string;
  subTopics: string[];
}

export interface Project {
  title: string;
  description: string;
  difficulty: string;
}

export interface AdditionalResource {
  title: string;
  type: 'article' | 'documentation' | 'course' | 'tool' | 'book';
  url: string;
  description?: string;
}

export interface TechnologyRoadmap {
  id: string;
  technology: string;
  category: string;
  levels: ExperienceLevel[];
  overview: string;
  subTechnologies: SubTechnology[];
}

@Injectable({
  providedIn: 'root',
})
export class RoadmapService {
  private baseUrl = 'http://localhost:3000/api';
  private readonly technologyCatalog: TechnologyRoadmap[] = [
    {
      id: 'frontend',
      technology: 'Frontend Development',
      category: 'Web',
      levels: ['Fresher', 'Experienced'],
      overview: 'Learn how to build responsive, accessible, and high-performance user interfaces.',
      subTechnologies: [
        {
          id: 'html-css',
          title: 'HTML & CSS Fundamentals',
          description: 'Master the building blocks of web pages with semantic HTML and modern CSS styling techniques.',
          whatYouWillLearn: [
            'Semantic HTML structure and accessibility',
            'Flexbox and CSS Grid layouts',
            'Responsive UI patterns and media queries',
            'CSS custom properties and modern styling'
          ],
          videos: [
            {
              title: 'HTML and CSS Full Course',
              channel: 'SuperSimpleDev',
              url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc'
            },
            {
              title: 'Responsive Web Design Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=srvUrASNj0s'
            }
          ],
          detailedContent: {
            overview: 'HTML (HyperText Markup Language) provides the structure and content of web pages, while CSS (Cascading Style Sheets) handles the presentation and layout. Together, they form the foundation of every website. This module covers semantic HTML5 elements, modern CSS layout systems, responsive design principles, and best practices for creating accessible, performant web interfaces.',
            prerequisites: ['Basic computer literacy', 'Understanding of web concepts', 'Text editor familiarity'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'Semantic HTML5 elements (<header>, <nav>, <main>, <article>, <footer>)',
              'CSS Box Model (margin, border, padding, content)',
              'Flexbox for one-dimensional layouts',
              'CSS Grid for two-dimensional layouts',
              'Media queries for responsive design',
              'CSS custom properties (variables)',
              'Accessibility best practices (ARIA attributes, alt text)',
              'Performance optimization (critical CSS, lazy loading)'
            ],
            topics: [
              {
                title: 'HTML Structure & Semantics',
                description: 'Learn how to create well-structured, accessible HTML documents using semantic elements.',
                subTopics: [
                  'Document structure (DOCTYPE, html, head, body)',
                  'Semantic elements and their purposes',
                  'Forms and input validation',
                  'Tables and accessibility',
                  'Metadata and SEO optimization'
                ]
              },
              {
                title: 'CSS Fundamentals',
                description: 'Master CSS syntax, selectors, and core styling concepts.',
                subTopics: [
                  'CSS syntax and rule structure',
                  'Selectors (element, class, ID, attribute, pseudo)',
                  'Color systems and units',
                  'Typography and text styling',
                  'Box model and spacing'
                ]
              },
              {
                title: 'Layout Systems',
                description: 'Learn modern CSS layout techniques for complex designs.',
                subTopics: [
                  'Flexbox container and item properties',
                  'CSS Grid template areas and tracks',
                  'Positioning (static, relative, absolute, fixed, sticky)',
                  'Float and clearfix techniques',
                  'Responsive layout strategies'
                ]
              },
              {
                title: 'Responsive Design',
                description: 'Create designs that work seamlessly across all devices and screen sizes.',
                subTopics: [
                  'Mobile-first design approach',
                  'Media queries and breakpoints',
                  'Fluid typography and spacing',
                  'Responsive images and art direction',
                  'Touch-friendly interfaces'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Personal Portfolio Website',
                description: 'Create a responsive portfolio website with multiple sections, contact form, and smooth navigation.',
                difficulty: 'Beginner'
              },
              {
                title: 'Landing Page Design',
                description: 'Build a modern landing page with hero section, features, testimonials, and call-to-action elements.',
                difficulty: 'Beginner'
              },
              {
                title: 'Responsive Dashboard Layout',
                description: 'Design a complex dashboard layout using CSS Grid and Flexbox with sidebar navigation and data visualization areas.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'MDN Web Docs - HTML',
                type: 'documentation',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                description: 'Comprehensive HTML reference and guides from Mozilla'
              },
              {
                title: 'MDN Web Docs - CSS',
                type: 'documentation',
                url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
                description: 'Complete CSS documentation and tutorials'
              },
              {
                title: 'CSS Tricks',
                type: 'article',
                url: 'https://css-tricks.com/',
                description: 'Daily articles about CSS and web design'
              },
              {
                title: 'Can I Use',
                type: 'tool',
                url: 'https://caniuse.com/',
                description: 'Browser compatibility tables for CSS features'
              }
            ]
          }
        },
        {
          id: 'javascript-typescript',
          title: 'JavaScript & TypeScript',
          description: 'Build dynamic web applications with modern JavaScript and add type safety with TypeScript.',
          whatYouWillLearn: [
            'Modern JavaScript (ES6+) features and syntax',
            'Asynchronous programming patterns',
            'Type-safe development with TypeScript',
            'DOM manipulation and event handling'
          ],
          videos: [
            {
              title: 'JavaScript Full Course for Beginners',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg'
            },
            {
              title: 'TypeScript in 100 Minutes',
              channel: 'Fireship',
              url: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA'
            }
          ],
          detailedContent: {
            overview: 'JavaScript is the programming language of the web, enabling dynamic and interactive content. TypeScript builds on JavaScript by adding static typing, which helps catch errors early and improves code quality. This module covers modern JavaScript features, asynchronous programming, TypeScript fundamentals, and how to effectively use both languages in web development.',
            prerequisites: ['HTML & CSS basics', 'Understanding of programming concepts', 'Basic algebra and logical thinking'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Variables (let, const) and scoping',
              'Arrow functions and template literals',
              'Destructuring and spread operators',
              'Promises and async/await',
              'Classes and object-oriented programming',
              'TypeScript interfaces and types',
              'Generics and utility types',
              'DOM manipulation and event handling',
              'Error handling and debugging techniques'
            ],
            topics: [
              {
                title: 'JavaScript Fundamentals',
                description: 'Master core JavaScript concepts and modern syntax.',
                subTopics: [
                  'Variables, data types, and operators',
                  'Control flow (if/else, switch, loops)',
                  'Functions and scope',
                  'Arrays and array methods',
                  'Objects and object methods'
                ]
              },
              {
                title: 'Modern JavaScript (ES6+)',
                description: 'Learn the latest JavaScript features and syntax.',
                subTopics: [
                  'Arrow functions and this binding',
                  'Template literals and string methods',
                  'Destructuring assignment',
                  'Spread and rest operators',
                  'Modules (import/export)',
                  'Optional chaining and nullish coalescing'
                ]
              },
              {
                title: 'Asynchronous Programming',
                description: 'Handle asynchronous operations with callbacks, promises, and async/await.',
                subTopics: [
                  'Event loop and call stack',
                  'Callbacks and callback hell',
                  'Promises and promise chaining',
                  'Async/await syntax',
                  'Error handling in async code',
                  'Parallel vs sequential execution'
                ]
              },
              {
                title: 'TypeScript Fundamentals',
                description: 'Add type safety to your JavaScript code with TypeScript.',
                subTopics: [
                  'Basic types and type inference',
                  'Interfaces and type aliases',
                  'Classes and access modifiers',
                  'Generics and utility types',
                  'Type guards and type narrowing',
                  'Configuration and compilation'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Todo List Application',
                description: 'Build a fully functional todo app with CRUD operations using vanilla JavaScript.',
                difficulty: 'Beginner'
              },
              {
                title: 'Weather App with API Integration',
                description: 'Create a weather application that fetches data from a public API and displays current conditions.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Shopping Cart',
                description: 'Develop a shopping cart with product management, cart functionality, and localStorage persistence.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'MDN Web Docs - JavaScript',
                type: 'documentation',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                description: 'Complete JavaScript guide and reference'
              },
              {
                title: 'TypeScript Handbook',
                type: 'documentation',
                url: 'https://www.typescriptlang.org/docs/',
                description: 'Official TypeScript documentation and tutorials'
              },
              {
                title: 'JavaScript.info',
                type: 'course',
                url: 'https://javascript.info/',
                description: 'Modern JavaScript tutorial from basics to advanced'
              },
              {
                title: 'You Don\'t Know JS',
                type: 'book',
                url: 'https://github.com/getify/You-Dont-Know-JS',
                description: 'Deep dive into JavaScript core mechanisms'
              }
            ]
          }
        },
        {
          id: 'angular-core',
          title: 'Angular Core',
          description: 'Build powerful single-page applications with Angular\'s component-based architecture and comprehensive framework.',
          whatYouWillLearn: [
            'Component architecture and lifecycle',
            'Dependency injection and services',
            'Routing and navigation guards',
            'Forms handling and validation'
          ],
          videos: [
            {
              title: 'Angular Full Course',
              channel: 'Programming with Mosh',
              url: 'https://www.youtube.com/watch?v=3qBXWUpoPHo'
            },
            {
              title: 'Angular Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=3dHNOWTI7H8'
            }
          ],
          detailedContent: {
            overview: 'Angular is a comprehensive front-end framework developed by Google for building dynamic web applications. It provides a structured approach to development with TypeScript, component-based architecture, powerful tools, and excellent performance. This module covers core Angular concepts including components, services, dependency injection, routing, forms, and best practices for building scalable applications.',
            prerequisites: ['TypeScript fundamentals', 'JavaScript ES6+ features', 'HTML & CSS basics', 'Understanding of MVC patterns'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Components and templates',
              'Directives and pipes',
              'Services and dependency injection',
              'Modules and lazy loading',
              'Routing and navigation',
              'Forms (template-driven and reactive)',
              'HTTP client and observables',
              'Lifecycle hooks',
              'Change detection strategies',
              'Testing with Jasmine and Karma'
            ],
            topics: [
              {
                title: 'Angular Fundamentals',
                description: 'Master the core concepts of Angular framework architecture.',
                subTopics: [
                  'Angular CLI and project structure',
                  'Components and templates',
                  'Data binding and interpolation',
                  'Directives (structural, attribute)',
                  'Pipes and data transformation',
                  'Modules and NgModules'
                ]
              },
              {
                title: 'Services & Dependency Injection',
                description: 'Learn how to create reusable services and manage dependencies.',
                subTopics: [
                  'Creating and injecting services',
                  'Singleton vs multiple instances',
                  'Providing dependencies at different levels',
                  'HttpClient and HTTP services',
                  'Error handling and interceptors'
                ]
              },
              {
                title: 'Routing & Navigation',
                description: 'Implement client-side routing and navigation in Angular apps.',
                subTopics: [
                  'Setting up routes and parameters',
                  'Router outlet and navigation',
                  'Route guards (canActivate, canLoad)',
                  'Lazy loading modules',
                  'Query parameters and fragments'
                ]
              },
              {
                title: 'Forms & Validation',
                description: 'Handle user input with form controls and validation.',
                subTopics: [
                  'Template-driven forms',
                  'Reactive forms and form groups',
                  'Custom validators',
                  'Dynamic forms',
                  'Form validation and error handling'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Task Management Application',
                description: 'Build a complete task management app with CRUD operations, routing, and form validation.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Product Catalog',
                description: 'Create an e-commerce frontend with product listing, filtering, cart functionality, and checkout.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Real-time Dashboard',
                description: 'Develop a real-time dashboard with data visualization, live updates, and authentication.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Angular Documentation',
                type: 'documentation',
                url: 'https://angular.io/docs',
                description: 'Official Angular documentation and guides'
              },
              {
                title: 'Angular University',
                type: 'course',
                url: 'https://angular-university.io/',
                description: 'In-depth Angular courses and tutorials'
              },
              {
                title: 'Angular Architectural Patterns',
                type: 'article',
                url: 'https://blog.angular-university.io/',
                description: 'Best practices and architectural patterns'
              }
            ]
          }
        },
        {
          id: 'frontend-testing',
          title: 'Frontend Testing',
          description: 'Ensure code quality and prevent regressions with comprehensive testing strategies for frontend applications.',
          whatYouWillLearn: [
            'Unit testing fundamentals and best practices',
            'Component testing and integration testing',
            'End-to-end testing with modern frameworks',
            'Test-driven development (TDD) workflows'
          ],
          videos: [
            {
              title: 'Testing JavaScript - Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=8Xwq35cPwYg'
            },
            {
              title: 'Angular Unit Testing Basics',
              channel: 'Decoded Frontend',
              url: 'https://www.youtube.com/watch?v=Fr7fNfK9gN8'
            }
          ],
          detailedContent: {
            overview: 'Testing is crucial for maintaining code quality and preventing regressions in frontend applications. This module covers the complete testing pyramid from unit tests to end-to-end testing, including testing frameworks, mocking strategies, and test-driven development practices. Learn how to write maintainable tests that give confidence in your code.',
            prerequisites: ['JavaScript/TypeScript fundamentals', 'Understanding of testing concepts', 'Basic frontend framework knowledge'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Testing pyramid (unit, integration, e2e)',
              'Test runners and frameworks (Jest, Mocha, Jasmine)',
              'Assertion libraries and matchers',
              'Mocking and stubbing dependencies',
              'Component testing approaches',
              'End-to-end testing with Cypress/Playwright',
              'Test-driven development (TDD)',
              'Code coverage and quality metrics',
              'Testing async code and HTTP requests',
              'Visual regression testing'
            ],
            topics: [
              {
                title: 'Unit Testing Fundamentals',
                description: 'Master the principles and practices of unit testing.',
                subTopics: [
                  'Testing principles and best practices',
                  'Setting up test environments',
                  'Writing testable code',
                  'Test structure and organization',
                  'Assertions and expectations'
                ]
              },
              {
                title: 'Testing Frameworks',
                description: 'Learn popular testing frameworks and their ecosystems.',
                subTopics: [
                  'Jest testing framework',
                  'Mocha and Chai',
                  'Jasmine and Karma',
                  'Vitest for modern applications',
                  'Test configuration and setup'
                ]
              },
              {
                title: 'Component Testing',
                description: 'Test UI components in isolation and integration.',
                subTopics: [
                  'Testing library approaches',
                  'Component rendering and snapshots',
                  'User interaction testing',
                  'Form validation testing',
                  'Router and navigation testing'
                ]
              },
              {
                title: 'End-to-End Testing',
                description: 'Automate browser testing for complete user flows.',
                subTopics: [
                  'Cypress framework fundamentals',
                  'Playwright testing',
                  'Page object model pattern',
                  'Testing authentication and flows',
                  'CI/CD integration'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Test Suite for Todo App',
                description: 'Create comprehensive tests for a todo application including unit, integration, and e2e tests.',
                difficulty: 'Beginner'
              },
              {
                title: 'Component Library Testing',
                description: 'Build and test a reusable component library with full test coverage.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Testing Framework',
                description: 'Develop a complete testing suite for an e-commerce application with complex user flows.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Jest Documentation',
                type: 'documentation',
                url: 'https://jestjs.io/docs/getting-started',
                description: 'Official Jest testing framework documentation'
              },
              {
                title: 'Testing Library',
                type: 'documentation',
                url: 'https://testing-library.com/docs/',
                description: 'Simple and complete testing utilities'
              },
              {
                title: 'Cypress Documentation',
                type: 'documentation',
                url: 'https://docs.cypress.io/',
                description: 'Fast, easy and reliable testing for anything'
              },
              {
                title: 'Test-Driven JavaScript',
                type: 'book',
                url: 'https://www.manning.com/books/test-driven-javascript-development',
                description: 'Comprehensive guide to TDD in JavaScript'
              }
            ]
          }
        },
        {
          id: 'performance-a11y',
          title: 'Performance & Accessibility',
          description: 'Create fast, performant web applications that are accessible to all users regardless of their abilities or devices.',
          whatYouWillLearn: [
            'Core Web Vitals and performance metrics',
            'Optimization techniques for speed and efficiency',
            'Web Content Accessibility Guidelines (WCAG)',
            'Inclusive design and testing strategies'
          ],
          videos: [
            {
              title: 'Web Performance Fundamentals',
              channel: 'Google Chrome Developers',
              url: 'https://www.youtube.com/watch?v=aqvz5Oqs238'
            },
            {
              title: 'Web Accessibility Crash Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=20SHvU2PKsM'
            }
          ],
          detailedContent: {
            overview: 'Performance and accessibility are critical aspects of modern web development. This module covers techniques for optimizing web applications for speed, efficiency, and inclusivity. Learn about Core Web Vitals, performance optimization strategies, WCAG guidelines, and how to create web experiences that work well for everyone.',
            prerequisites: ['HTML & CSS fundamentals', 'JavaScript basics', 'Understanding of web performance concepts'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Core Web Vitals (LCP, FID, CLS)',
              'Performance monitoring and measurement',
              'Code splitting and lazy loading',
              'Image optimization and compression',
              'Caching strategies and service workers',
              'WCAG 2.1 guidelines and levels',
              'Semantic HTML and ARIA attributes',
              'Keyboard navigation and focus management',
              'Screen reader optimization',
              'Performance budgeting and optimization'
            ],
            topics: [
              {
                title: 'Web Performance Fundamentals',
                description: 'Understand what makes web applications fast and efficient.',
                subTopics: [
                  'Core Web Vitals explained',
                  'Performance monitoring tools (Lighthouse, WebPageTest)',
                  'Performance budgets and metrics',
                  'Browser rendering pipeline',
                  'Network optimization techniques'
                ]
              },
              {
                title: 'Performance Optimization',
                description: 'Implement strategies to improve application performance.',
                subTopics: [
                  'Code splitting and lazy loading',
                  'Tree shaking and dead code elimination',
                  'Asset optimization (images, fonts, scripts)',
                  'Caching strategies (HTTP, service workers)',
                  'Minification and compression'
                ]
              },
              {
                title: 'Accessibility Fundamentals',
                description: 'Learn principles and guidelines for accessible web design.',
                subTopics: [
                  'WCAG 2.1 guidelines overview',
                  'Semantic HTML and landmarks',
                  'ARIA roles and attributes',
                  'Color contrast and visual design',
                  'Text alternatives and media accessibility'
                ]
              },
              {
                title: 'Inclusive Development',
                description: 'Build applications that work for all users.',
                subTopics: [
                  'Keyboard navigation and focus management',
                  'Screen reader optimization',
                  'Responsive and adaptive design',
                  'Accessibility testing and auditing',
                  'Progressive enhancement strategies'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Performance Audit and Optimization',
                description: 'Audit an existing website and implement performance optimizations to achieve 90+ Lighthouse score.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Accessible Component Library',
                description: 'Build a component library that meets WCAG AA standards and includes full accessibility features.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Performance Monitoring Dashboard',
                description: 'Create a dashboard that tracks Core Web Vitals and provides actionable optimization insights.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Web.dev Performance Guide',
                type: 'documentation',
                url: 'https://web.dev/performance/',
                description: 'Comprehensive performance optimization guides'
              },
              {
                title: 'WCAG 2.1 Guidelines',
                type: 'documentation',
                url: 'https://www.w3.org/WAI/WCAG21/quickref/',
                description: 'Official Web Content Accessibility Guidelines'
              },
              {
                title: 'A11Y Project',
                type: 'tool',
                url: 'https://www.a11yproject.com/',
                description: 'Community-driven accessibility resources'
              },
              {
                title: 'Web Performance Calendar',
                type: 'article',
                url: 'https://calendar.perfplanet.com/',
                description: 'Annual collection of performance articles'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'backend',
      technology: 'Backend Engineering',
      category: 'Server',
      levels: ['Fresher', 'Experienced'],
      overview: 'Build robust APIs, secure services, and scalable backend systems using various programming languages and frameworks.',
      subTechnologies: [
        {
          id: 'java-spring',
          title: 'Java & Spring Framework',
          description: 'Build enterprise-grade applications using Java and the Spring ecosystem.',
          whatYouWillLearn: [
            'Java programming fundamentals',
            'Spring Boot and Spring MVC',
            'RESTful API development',
            'Database integration with JPA/Hibernate'
          ],
          videos: [
            {
              title: 'Java Full Course',
              channel: 'Programming with Mosh',
              url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo'
            },
            {
              title: 'Spring Boot Tutorial',
              channel: 'Amigoscode',
              url: 'https://www.youtube.com/watch?v=9SGDpanRC8g'
            }
          ],
          detailedContent: {
            overview: 'Java is one of the most popular programming languages for enterprise backend development. The Spring ecosystem provides comprehensive tools for building robust, scalable applications. This module covers Java fundamentals, Spring Boot, Spring MVC, database integration, and enterprise application development.',
            prerequisites: ['Object-oriented programming concepts', 'Basic programming knowledge', 'Understanding of client-server architecture'],
            estimatedTime: '10-12 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Java language fundamentals',
              'Object-oriented programming in Java',
              'Spring Boot configuration',
              'Dependency injection',
              'RESTful API development',
              'Database integration with JPA',
              'Testing with JUnit and Mockito',
              'Spring Security',
              'Microservices with Spring Cloud',
              'Enterprise patterns and best practices'
            ],
            topics: [
              {
                title: 'Java Fundamentals',
                description: 'Master Java programming language basics.',
                subTopics: [
                  'Java syntax and structure',
                  'Object-oriented concepts',
                  'Collections framework',
                  'Exception handling',
                  'Generics and lambda expressions'
                ]
              },
              {
                title: 'Spring Framework',
                description: 'Learn Spring ecosystem for enterprise development.',
                subTopics: [
                  'Spring Boot fundamentals',
                  'Spring MVC for web apps',
                  'Spring Data JPA',
                  'Spring Security',
                  'Spring Cloud for microservices'
                ]
              },
              {
                title: 'API Development',
                description: 'Build RESTful APIs with Spring.',
                subTopics: [
                  'REST principles',
                  'Controller development',
                  'Request/response handling',
                  'Validation and error handling',
                  'API documentation (Swagger)'
                ]
              },
              {
                title: 'Enterprise Development',
                description: 'Build enterprise-grade applications.',
                subTopics: [
                  'Transactional management',
                  'Caching strategies',
                  'Message queuing with Spring',
                  'Monitoring and logging',
                  'Performance optimization'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'E-commerce Backend',
                description: 'Build a complete e-commerce backend with Spring Boot, covering users, products, orders, and payments.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Microservices Architecture',
                description: 'Create a microservices application using Spring Cloud with service discovery, configuration, and API gateway.',
                difficulty: 'Advanced'
              },
              {
                title: 'Enterprise API Gateway',
                description: 'Develop an API gateway with authentication, rate limiting, and routing for multiple microservices.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Spring Documentation',
                type: 'documentation',
                url: 'https://spring.io/guides',
                description: 'Official Spring framework guides'
              },
              {
                title: 'Baeldung Spring Tutorials',
                type: 'article',
                url: 'https://www.baeldung.com/',
                description: 'Comprehensive Spring tutorials'
              },
              {
                title: 'Java Documentation',
                type: 'documentation',
                url: 'https://docs.oracle.com/en/java/',
                description: 'Official Java documentation'
              }
            ]
          }
        },
        {
          id: 'dotnet-core',
          title: '.NET Core & C#',
          description: 'Build modern backend applications using Microsoft .NET and C# programming language.',
          whatYouWillLearn: [
            'C# programming fundamentals',
            '.NET Core and ASP.NET Core',
            'Entity Framework Core',
            'Azure integration and deployment'
          ],
          videos: [
            {
              title: 'C# and .NET Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=GcF-18kqRcU'
            },
            {
              title: 'ASP.NET Core Tutorial',
              channel: 'IAMTimCorey',
              url: 'https://www.youtube.com/watch?v=rCxx3RZ4J5U'
            }
          ],
          detailedContent: {
            overview: '.NET Core is a cross-platform framework for building modern applications with C#. This module covers C# programming fundamentals, ASP.NET Core for web development, Entity Framework for database operations, and cloud integration with Azure. Learn to build scalable, high-performance backend applications.',
            prerequisites: ['Basic programming knowledge', 'Understanding of OOP concepts', 'Familiarity with Microsoft technologies'],
            estimatedTime: '10-12 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'C# language features and syntax',
              '.NET Core framework',
              'ASP.NET Core web development',
              'Entity Framework Core',
              'Dependency injection in .NET',
              'Middleware pipeline',
              'Authentication and authorization',
              'Web API development',
              'Azure cloud integration',
              'Testing with xUnit and Moq'
            ],
            topics: [
              {
                title: 'C# Fundamentals',
                description: 'Master C# programming language.',
                subTopics: [
                  'C# syntax and structure',
                  'Object-oriented programming',
                  'LINQ and collections',
                  'Async/await patterns',
                  'Memory management and garbage collection'
                ]
              },
              {
                title: 'ASP.NET Core',
                description: 'Build web applications with ASP.NET Core.',
                subTopics: [
                  'ASP.NET Core fundamentals',
                  'MVC pattern',
                  'Middleware pipeline',
                  'Dependency injection',
                  'Configuration management'
                ]
              },
              {
                title: 'Database Integration',
                description: 'Integrate databases using Entity Framework.',
                subTopics: [
                  'Entity Framework Core',
                  'DbContext and migrations',
                  'LINQ to Entities',
                  'Relationships and navigation',
                  'Performance optimization'
                ]
              },
              {
                title: 'Azure Integration',
                description: 'Deploy and scale applications on Azure.',
                subTopics: [
                  'Azure App Service',
                  'Azure Functions',
                  'Azure SQL Database',
                  'Azure Storage',
                  'Azure DevOps integration'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'ASP.NET Core Web API',
                description: 'Build a complete REST API with ASP.NET Core, Entity Framework, and Azure SQL integration.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Enterprise Application',
                description: 'Create an enterprise application with authentication, authorization, and microservices architecture.',
                difficulty: 'Advanced'
              },
              {
                title: 'Azure Cloud Application',
                description: 'Develop and deploy a scalable application on Azure using App Service, Functions, and Cosmos DB.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: '.NET Documentation',
                type: 'documentation',
                url: 'https://docs.microsoft.com/en-us/dotnet/',
                description: 'Official .NET documentation'
              },
              {
                title: 'ASP.NET Core Docs',
                type: 'documentation',
                url: 'https://docs.microsoft.com/en-us/aspnet/core/',
                description: 'ASP.NET Core framework documentation'
              },
              {
                title: 'Entity Framework Core',
                type: 'documentation',
                url: 'https://docs.microsoft.com/en-us/ef/core/',
                description: 'ORM framework documentation'
              }
            ]
          }
        },
        {
          id: 'python-backend',
          title: 'Python Backend Development',
          description: 'Build powerful backend applications using Python with Django, Flask, and FastAPI.',
          whatYouWillLearn: [
            'Python programming fundamentals',
            'Django web framework',
            'Flask microframework',
            'FastAPI for high-performance APIs'
          ],
          videos: [
            {
              title: 'Python Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=rfscVS0vtbw'
            },
            {
              title: 'Django Full Course',
              channel: 'Corey Schafer',
              url: 'https://www.youtube.com/watch?v=F5mRW0jo-Yw'
            }
          ],
          detailedContent: {
            overview: 'Python is one of the most versatile programming languages for backend development. This module covers Python fundamentals, Django for full-stack web development, Flask for lightweight applications, and FastAPI for high-performance APIs. Learn to build scalable backend solutions using the Python ecosystem.',
            prerequisites: ['Basic programming knowledge', 'Understanding of web concepts', 'Familiarity with command line'],
            estimatedTime: '10-12 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Python language fundamentals',
              'Django MVC architecture',
              'Flask microframework',
              'FastAPI async framework',
              'Database integration',
              'RESTful API development',
              'Authentication and authorization',
              'Testing with pytest',
              'Performance optimization',
              'Deployment strategies'
            ],
            topics: [
              {
                title: 'Python Fundamentals',
                description: 'Master Python programming language.',
                subTopics: [
                  'Python syntax and structure',
                  'Data types and collections',
                  'Functions and classes',
                  'Decorators and generators',
                  'Async/await patterns'
                ]
              },
              {
                title: 'Django Development',
                description: 'Build full-stack applications with Django.',
                subTopics: [
                  'Django project structure',
                  'Models and ORM',
                  'Views and templates',
                  'Forms and validation',
                  'Django admin interface'
                ]
              },
              {
                title: 'Flask & FastAPI',
                description: 'Build lightweight and high-performance APIs.',
                subTopics: [
                  'Flask fundamentals',
                  'Blueprints and extensions',
                  'FastAPI async framework',
                  'Pydantic validation',
                  'API documentation'
                ]
              },
              {
                title: 'Advanced Python Backend',
                description: 'Implement advanced backend features.',
                subTopics: [
                  'Authentication systems',
                  'Database optimization',
                  'Caching strategies',
                  'Background tasks',
                  'API testing'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Django E-commerce Platform',
                description: 'Build a complete e-commerce platform with Django, PostgreSQL, Redis, and Celery.',
                difficulty: 'Intermediate'
              },
              {
                title: 'FastAPI Microservices',
                description: 'Create a microservices architecture using FastAPI, Docker, and Kubernetes.',
                difficulty: 'Advanced'
              },
              {
                title: 'API Gateway with Python',
                description: 'Develop an API gateway with authentication, rate limiting, and routing for multiple services.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Django Documentation',
                type: 'documentation',
                url: 'https://docs.djangoproject.com/',
                description: 'Official Django framework documentation'
              },
              {
                title: 'Flask Documentation',
                type: 'documentation',
                url: 'https://flask.palletsprojects.com/',
                description: 'Flask microframework documentation'
              },
              {
                title: 'FastAPI Documentation',
                type: 'documentation',
                url: 'https://fastapi.tiangolo.com/',
                description: 'FastAPI framework documentation'
              }
            ]
          }
        },
        {
          id: 'golang',
          title: 'Go (Golang) Backend Development',
          description: 'Build high-performance, scalable backend applications using Go programming language.',
          whatYouWillLearn: [
            'Go programming fundamentals',
            'Goroutines and channels',
            'Go web frameworks (Gin, Echo)',
            'Microservices architecture'
          ],
          videos: [
            {
              title: 'Go Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=SqrbIlUwR0U'
            },
            {
              title: 'Gin Framework Tutorial',
              channel: 'Tech with Tim',
              url: 'https://www.youtube.com/watch?v=8TJh2tI0PJM'
            }
          ],
          detailedContent: {
            overview: 'Go is a statically typed, compiled language designed for simplicity and performance. This module covers Go fundamentals, concurrent programming with goroutines and channels, web development with Go frameworks, and microservices architecture. Learn to build high-performance, scalable backend systems.',
            prerequisites: ['Basic programming knowledge', 'Understanding of concurrency', 'System programming concepts'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Go language syntax and structure',
              'Goroutines and concurrent programming',
              'Channels for communication',
              'Go standard library',
              'Web frameworks (Gin, Echo, Chi)',
              'RESTful API development',
              'Database integration',
              'Error handling patterns',
              'Testing and benchmarking',
              'Microservices and distributed systems'
            ],
            topics: [
              {
                title: 'Go Fundamentals',
                description: 'Master Go programming language.',
                subTopics: [
                  'Go syntax and structure',
                  'Types and interfaces',
                  'Functions and methods',
                  'Error handling',
                  'Package management'
                ]
              },
              {
                title: 'Concurrent Programming',
                description: 'Implement concurrent solutions with Go.',
                subTopics: [
                  'Goroutines',
                  'Channels and communication',
                  'Select statements',
                  'Sync patterns',
                  'Concurrency patterns'
                ]
              },
              {
                title: 'Web Development',
                description: 'Build web applications with Go.',
                subTopics: [
                  'HTTP server fundamentals',
                  'Gin framework',
                  'Routing and middleware',
                  'JSON handling',
                  'Templates and rendering'
                ]
              },
              {
                title: 'Advanced Go Backend',
                description: 'Build scalable backend systems.',
                subTopics: [
                  'Database integration (SQL, NoSQL)',
                  'Authentication and JWT',
                  'Caching with Redis',
                  'Message queuing',
                  'Performance optimization'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'High-Performance API',
                description: 'Build a high-performance REST API with Gin, PostgreSQL, and Redis.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Concurrent Processing System',
                description: 'Create a concurrent processing system with goroutines and channels for high-throughput tasks.',
                difficulty: 'Advanced'
              },
              {
                title: 'Go Microservices',
                description: 'Develop a microservices architecture using Go, gRPC, and Docker.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Go Documentation',
                type: 'documentation',
                url: 'https://golang.org/doc/',
                description: 'Official Go programming language documentation'
              },
              {
                title: 'Gin Framework',
                type: 'documentation',
                url: 'https://gin-gonic.com/docs/',
                description: 'Gin web framework documentation'
              },
              {
                title: 'Effective Go',
                type: 'documentation',
                url: 'https://golang.org/doc/effective_go.html',
                description: 'Best practices for writing Go code'
              }
            ]
          }
        },
        {
          id: 'cpp-backend',
          title: 'C++ Backend Development',
          description: 'Build high-performance backend systems and applications using C++ programming language.',
          whatYouWillLearn: [
            'C++ programming fundamentals',
            'STL and memory management',
            'Network programming with C++',
            'Performance optimization'
          ],
          videos: [
            {
              title: 'C++ Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y'
            },
            {
              title: 'C++ Network Programming',
              channel: 'The Cherno',
              url: 'https://www.youtube.com/watch?v=hGICZdPd4Hg'
            }
          ],
          detailedContent: {
            overview: 'C++ is a powerful, high-performance language used for systems programming and performance-critical applications. This module covers C++ fundamentals, STL, memory management, network programming, and performance optimization. Learn to build efficient, high-performance backend systems.',
            prerequisites: ['Programming fundamentals', 'Understanding of memory concepts', 'Computer architecture basics'],
            estimatedTime: '12-14 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'C++ language features and syntax',
              'Object-oriented programming in C++',
              'STL (Standard Template Library)',
              'Memory management and RAII',
              'Network programming',
              'Multi-threading and concurrency',
              'Database connectivity',
              'Performance optimization',
              'Build systems and debugging',
              'Modern C++ features'
            ],
            topics: [
              {
                title: 'C++ Fundamentals',
                description: 'Master C++ programming language.',
                subTopics: [
                  'C++ syntax and structure',
                  'Classes and inheritance',
                  'Templates and generics',
                  'Smart pointers',
                  'Move semantics'
                ]
              },
              {
                title: 'STL & Containers',
                description: 'Utilize STL for efficient development.',
                subTopics: [
                  'Containers (vector, map, set)',
                  'Algorithms and iterators',
                  'Function objects and lambdas',
                  'Smart pointers',
                  'String manipulation'
                ]
              },
              {
                title: 'Network Programming',
                description: 'Implement network solutions with C++.',
                subTopics: [
                  'Socket programming',
                  'HTTP server development',
                  'TCP/UDP protocols',
                  'Asynchronous I/O',
                  'Network libraries'
                ]
              },
              {
                title: 'Performance Optimization',
                description: 'Optimize C++ applications for performance.',
                subTopics: [
                  'Profiling and analysis',
                  'Memory optimization',
                  'Algorithm efficiency',
                  'Compiler optimizations',
                  'Parallel programming'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'High-Performance Server',
                description: 'Build a high-performance network server with C++ handling thousands of concurrent connections.',
                difficulty: 'Advanced'
              },
              {
                title: 'Database Library',
                description: 'Create a custom database library with C++ featuring efficient data structures and algorithms.',
                difficulty: 'Advanced'
              },
              {
                title: 'Trading System',
                description: 'Develop a low-latency trading system with C++ optimized for maximum performance.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'C++ Reference',
                type: 'documentation',
                url: 'https://en.cppreference.com/',
                description: 'Comprehensive C++ documentation'
              },
              {
                title: 'C++ Documentation',
                type: 'documentation',
                url: 'https://isocpp.org/',
                description: 'Official C++ resources'
              },
              {
                title: 'Modern C++ Tutorial',
                type: 'course',
                url: 'https://github.com/fishercoder1534/Leetcode',
                description: 'Modern C++ best practices'
              }
            ]
          }
        },
        {
          id: 'ruby-rails',
          title: 'Ruby on Rails Development',
          description: 'Build web applications quickly and efficiently using Ruby on Rails framework.',
          whatYouWillLearn: [
            'Ruby programming language',
            'Rails framework fundamentals',
            'RESTful API development',
            'Database integration and migrations'
          ],
          videos: [
            {
              title: 'Ruby Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=t_ispmWbgJY'
            },
            {
              title: 'Ruby on Rails Tutorial',
              channel: 'The Net Ninja',
              url: 'https://www.youtube.com/watch?v=fmyvWz5TUWg'
            }
          ],
          detailedContent: {
            overview: 'Ruby on Rails is a popular web application framework known for developer productivity and convention over configuration. This module covers Ruby programming, Rails fundamentals, database integration, and API development. Learn to build web applications rapidly using the Rails ecosystem.',
            prerequisites: ['Basic programming knowledge', 'Understanding of web concepts', 'Database fundamentals'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'Ruby language fundamentals',
              'Rails framework architecture',
              'MVC pattern in Rails',
              'Active Record ORM',
              'Rails routing',
              'RESTful conventions',
              'Asset pipeline',
              'Testing in Rails',
              'Deployment strategies',
              'Ruby ecosystem and gems'
            ],
            topics: [
              {
                title: 'Ruby Fundamentals',
                description: 'Master Ruby programming language.',
                subTopics: [
                  'Ruby syntax and structure',
                  'Object-oriented programming',
                  'Blocks and procs',
                  'Metaprogramming',
                  'Ruby standard library'
                ]
              },
              {
                title: 'Rails Fundamentals',
                description: 'Build web applications with Rails.',
                subTopics: [
                  'Rails project structure',
                  'Models and Active Record',
                  'Views and ERB',
                  'Controllers and routing',
                  'Scaffolding'
                ]
              },
              {
                title: 'Database Integration',
                description: 'Work with databases in Rails.',
                subTopics: [
                  'Active Record ORM',
                  'Migrations',
                  'Associations',
                  'Validations',
                  'Querying and performance'
                ]
              },
              {
                title: 'API Development',
                description: 'Build APIs with Rails.',
                subTopics: [
                  'Rails API mode',
                  'JSON responses',
                  'Versioning',
                  'Authentication (Devise, JWT)',
                  'Rate limiting'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Blog Application',
                description: 'Build a complete blog application with user authentication, posts, comments, and admin panel.',
                difficulty: 'Beginner'
              },
              {
                title: 'E-commerce Platform',
                description: 'Create an e-commerce platform with product management, cart, and payment integration.',
                difficulty: 'Intermediate'
              },
              {
                title: 'API Backend Service',
                description: 'Develop a RESTful API backend for a mobile application using Rails API mode.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'Rails Documentation',
                type: 'documentation',
                url: 'https://guides.rubyonrails.org/',
                description: 'Official Ruby on Rails guides'
              },
              {
                title: 'Ruby Documentation',
                type: 'documentation',
                url: 'https://ruby-doc.org/',
                description: 'Ruby language documentation'
              },
              {
                title: 'RailsApps Tutorials',
                type: 'article',
                url: 'https://railsapps.github.io/',
                description: 'Ruby on Rails tutorials and examples'
              }
            ]
          }
        },
        {
          id: 'php-laravel',
          title: 'PHP & Laravel Development',
          description: 'Build web applications and APIs using PHP with Laravel framework.',
          whatYouWillLearn: [
            'PHP programming fundamentals',
            'Laravel framework',
            'Eloquent ORM',
            'API development and authentication'
          ],
          videos: [
            {
              title: 'PHP Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=OK_JCtrrv-c'
            },
            {
              title: 'Laravel Tutorial',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=MtX5quEXQ7U'
            }
          ],
          detailedContent: {
            overview: 'PHP is a widely-used server-side scripting language for web development. Laravel is a modern PHP framework that makes web development elegant and enjoyable. This module covers PHP fundamentals, Laravel framework, database integration, and API development.',
            prerequisites: ['Basic programming knowledge', 'Understanding of web development', 'Database concepts'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'PHP language fundamentals',
              'Laravel framework architecture',
              'Eloquent ORM',
              'Blade templating',
              'Routing and controllers',
              'Middleware',
              'Authentication and authorization',
              'API resources',
              'Database migrations',
              'Laravel ecosystem and packages'
            ],
            topics: [
              {
                title: 'PHP Fundamentals',
                description: 'Master PHP programming language.',
                subTopics: [
                  'PHP syntax and structure',
                  'Variables and data types',
                  'Functions and classes',
                  'Error handling',
                  'File and directory operations'
                ]
              },
              {
                title: 'Laravel Framework',
                description: 'Build applications with Laravel.',
                subTopics: [
                  'Laravel project structure',
                  'Routing and controllers',
                  'Views and Blade templates',
                  'Middleware',
                  'Configuration'
                ]
              },
              {
                title: 'Database Integration',
                description: 'Work with databases using Laravel.',
                subTopics: [
                  'Eloquent ORM',
                  'Database migrations',
                  'Query builder',
                  'Relationships',
                  'Model events and observers'
                ]
              },
              {
                title: 'API Development',
                description: 'Build APIs with Laravel.',
                subTopics: [
                  'Laravel API resources',
                  'JSON responses',
                  'Authentication (Sanctum, Passport)',
                  'Rate limiting',
                  'API testing'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Content Management System',
                description: 'Build a complete CMS with Laravel featuring user roles, content management, and media upload.',
                difficulty: 'Beginner'
              },
              {
                title: 'RESTful API Backend',
                description: 'Create a RESTful API with Laravel, Eloquent, and MySQL for a mobile application.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Platform',
                description: 'Develop an e-commerce platform with Laravel, including products, cart, orders, and payment processing.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Laravel Documentation',
                type: 'documentation',
                url: 'https://laravel.com/docs',
                description: 'Official Laravel framework documentation'
              },
              {
                title: 'PHP Documentation',
                type: 'documentation',
                url: 'https://www.php.net/docs.php',
                description: 'Official PHP documentation'
              },
              {
                title: 'Laracasts',
                type: 'course',
                url: 'https://laracasts.com/',
                description: 'Premium Laravel and PHP tutorials'
              }
            ]
          }
        },
        {
          id: 'rust-backend',
          title: 'Rust Backend Development',
          description: 'Build safe, concurrent, and high-performance backend systems using Rust.',
          whatYouWillLearn: [
            'Rust programming fundamentals',
            'Memory safety and ownership',
            'Concurrent programming',
            'Web frameworks (Actix, Rocket)'
          ],
          videos: [
            {
              title: 'Rust Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=vOMJlfe5m9Y'
            },
            {
              title: 'Rust Web Development',
              channel: 'Ryan Levick',
              url: 'https://www.youtube.com/watch?v=rAl-9HwD8q8'
            }
          ],
          detailedContent: {
            overview: 'Rust is a systems programming language focused on safety, speed, and concurrency. This module covers Rust fundamentals, ownership model, concurrent programming, and web development with Rust frameworks. Learn to build memory-safe, high-performance backend applications.',
            prerequisites: ['Programming fundamentals', 'Understanding of memory management', 'Systems programming concepts'],
            estimatedTime: '12-14 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Rust language features and syntax',
              'Ownership and borrowing',
              'Lifetimes and references',
              'Pattern matching',
              'Error handling (Result, Option)',
              'Concurrent programming',
              'Web frameworks (Actix, Rocket)',
              'Database integration',
              'Testing and benchmarking',
              'Rust ecosystem and crates'
            ],
            topics: [
              {
                title: 'Rust Fundamentals',
                description: 'Master Rust programming language.',
                subTopics: [
                  'Rust syntax and structure',
                  'Ownership and borrowing',
                  'Lifetimes',
                  'Pattern matching',
                  'Error handling'
                ]
              },
              {
                title: 'Advanced Rust',
                description: 'Learn advanced Rust concepts.',
                subTopics: [
                  'Traits and generics',
                  'Smart pointers',
                  'Concurrent programming',
                  'Unsafe Rust',
                  'FFI and interoperability'
                ]
              },
              {
                title: 'Web Development',
                description: 'Build web applications with Rust.',
                subTopics: [
                  'Actix-web framework',
                  'Rocket framework',
                  'Routing and middleware',
                  'Database integration',
                  'Async Rust'
                ]
              },
              {
                title: 'Backend Systems',
                description: 'Build backend systems with Rust.',
                subTopics: [
                  'RESTful APIs',
                  'Authentication',
                  'Performance optimization',
                  'Memory safety',
                  'Deployment strategies'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Actix-web API',
                description: 'Build a high-performance REST API with Actix-web, PostgreSQL, and Redis.',
                difficulty: 'Advanced'
              },
              {
                title: 'Concurrent Processing Service',
                description: 'Create a concurrent processing service leveraging Rust\'s memory safety and performance.',
                difficulty: 'Advanced'
              },
              {
                title: 'Database Service',
                description: 'Develop a database service with custom storage engine optimized for performance.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Rust Documentation',
                type: 'documentation',
                url: 'https://doc.rust-lang.org/',
                description: 'Official Rust documentation'
              },
              {
                title: 'The Rust Book',
                type: 'documentation',
                url: 'https://doc.rust-lang.org/book/',
                description: 'Comprehensive Rust programming guide'
              },
              {
                title: 'Crates.io',
                type: 'tool',
                url: 'https://crates.io/',
                description: 'Rust package registry'
              }
            ]
          }
        },
        {
          id: 'node-express',
          title: 'Node.js and Express',
          description: 'Build powerful server-side applications and RESTful APIs with Node.js runtime and Express framework.',
          whatYouWillLearn: [
            'Node.js runtime and event loop',
            'Express routing and middleware',
            'RESTful API design patterns',
            'Error handling and debugging'
          ],
          videos: [
            {
              title: 'Node.js and Express Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=Oe421EPjeBE'
            },
            {
              title: 'Express JS Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=L72fhGm1tfE'
            }
          ],
          detailedContent: {
            overview: 'Node.js enables JavaScript to run outside the browser, making it possible to build server-side applications. Express is a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications. Together, they form a powerful combination for building APIs, real-time applications, and microservices.',
            prerequisites: ['JavaScript fundamentals', 'Understanding of HTTP protocol', 'Basic command line skills'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Node.js event loop and non-blocking I/O',
              'Modules system (CommonJS and ES modules)',
              'Express application structure and routing',
              'Middleware architecture and execution flow',
              'Request/response handling',
              'Error handling and logging',
              'RESTful API design principles',
              'Authentication and security basics',
              'File system operations and streaming',
              'Database integration (MongoDB, PostgreSQL)'
            ],
            topics: [
              {
                title: 'Node.js Fundamentals',
                description: 'Understand Node.js runtime environment and core concepts.',
                subTopics: [
                  'Node.js installation and npm',
                  'Global objects and modules',
                  'File system operations',
                  'HTTP server creation',
                  'Event loop and asynchronous programming'
                ]
              },
              {
                title: 'Express Framework',
                description: 'Master Express framework for building web applications and APIs.',
                subTopics: [
                  'Express application setup',
                  'Routing and route parameters',
                  'Middleware (built-in, third-party, custom)',
                  'Request and response handling',
                  'Static file serving',
                  'Template engines (EJS, Pug)'
                ]
              },
              {
                title: 'RESTful API Development',
                description: 'Design and implement RESTful APIs following best practices.',
                subTopics: [
                  'HTTP methods and status codes',
                  'Resource design and URL structure',
                  'Request validation and sanitization',
                  'Pagination and filtering',
                  'Versioning strategies',
                  'API documentation (Swagger)'
                ]
              },
              {
                title: 'Error Handling & Security',
                description: 'Implement robust error handling and security measures.',
                subTopics: [
                  'Error handling middleware',
                  'Logging and monitoring',
                  'Input validation and sanitization',
                  'Authentication (JWT, sessions)',
                  'Security headers and CORS',
                  'Rate limiting and DDoS protection'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'RESTful Blog API',
                description: 'Build a complete blog API with CRUD operations, user authentication, and comment system.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Backend',
                description: 'Create an e-commerce backend with product management, user accounts, and payment integration.',
                difficulty: 'Advanced'
              },
              {
                title: 'Real-time Chat Server',
                description: 'Develop a real-time chat application using WebSockets and Socket.io.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'Node.js Documentation',
                type: 'documentation',
                url: 'https://nodejs.org/docs/',
                description: 'Official Node.js documentation and API reference'
              },
              {
                title: 'Express.js Guide',
                type: 'documentation',
                url: 'https://expressjs.com/en/guide/routing.html',
                description: 'Official Express framework guide and API docs'
              },
              {
                title: 'REST API Tutorial',
                type: 'course',
                url: 'https://restfulapi.net/',
                description: 'Comprehensive guide to RESTful API design'
              },
              {
                title: 'OWASP Node.js Security Cheat Sheet',
                type: 'article',
                url: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html',
                description: 'Security best practices for Node.js applications'
              }
            ]
          }
        },
        {
          id: 'database-modeling',
          title: 'Database Modeling',
          description: 'Design efficient database schemas and choose the right persistence strategies for your applications.',
          whatYouWillLearn: [
            'Relational database design and normalization',
            'NoSQL document modeling',
            'Indexing strategies and query optimization',
            'Database scaling and performance tuning'
          ],
          videos: [
            {
              title: 'MongoDB Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=ofme2o29ngU'
            },
            {
              title: 'SQL Database Design Basics',
              channel: 'Kudvenkat',
              url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc'
            }
          ],
          detailedContent: {
            overview: 'Database modeling is fundamental to building scalable applications. This module covers both relational and NoSQL database design principles, schema optimization, indexing strategies, and performance tuning. Learn how to choose the right database technology and design efficient data models that support your application requirements.',
            prerequisites: ['Basic understanding of data structures', 'SQL fundamentals', 'Understanding of application architecture'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Relational database design principles',
              'Normalization and denormalization',
              'NoSQL data modeling patterns',
              'Index types and optimization',
              'Query performance analysis',
              'Database transactions and ACID',
              'Data migration strategies',
              'Database scaling (vertical, horizontal)',
              'Backup and recovery procedures',
              'Database security and access control'
            ],
            topics: [
              {
                title: 'Relational Database Design',
                description: 'Master the principles of designing relational databases.',
                subTopics: [
                  'Entity-relationship modeling',
                  'Normalization forms (1NF, 2NF, 3NF)',
                  'Primary and foreign keys',
                  'Relationships (one-to-one, one-to-many, many-to-many)',
                  'Schema design patterns'
                ]
              },
              {
                title: 'NoSQL Data Modeling',
                description: 'Learn data modeling techniques for document and key-value databases.',
                subTopics: [
                  'Document modeling patterns',
                  'Embedding vs referencing',
                  'Denormalization strategies',
                  'Graph database modeling',
                  'Time-series data handling'
                ]
              },
              {
                title: 'Performance Optimization',
                description: 'Optimize database performance through indexing and query tuning.',
                subTopics: [
                  'Index types and usage',
                  'Query execution plans',
                  'Indexing strategies',
                  'Query optimization techniques',
                  'Database caching'
                ]
              },
              {
                title: 'Scaling & Architecture',
                description: 'Design database architectures that scale with your application.',
                subTopics: [
                  'Vertical vs horizontal scaling',
                  'Read replicas and sharding',
                  'Database clustering',
                  'Polyglot persistence',
                  'Microservices database patterns'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'E-commerce Database Schema',
                description: 'Design and implement a complete database schema for an e-commerce platform with products, orders, and customers.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Social Media Data Model',
                description: 'Create a data model for a social media application handling users, posts, comments, and relationships.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Analytics Database Design',
                description: 'Design a high-performance database for real-time analytics with large-scale data processing.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Database Design Basics',
                type: 'course',
                url: 'https://www.coursera.org/learn/database-design',
                description: 'Comprehensive database design course'
              },
              {
                title: 'MongoDB University',
                type: 'course',
                url: 'https://university.mongodb.com/',
                description: 'Free MongoDB courses and certifications'
              },
              {
                title: 'PostgreSQL Documentation',
                type: 'documentation',
                url: 'https://www.postgresql.org/docs/',
                description: 'Comprehensive PostgreSQL documentation'
              },
              {
                title: 'SQL Performance Explained',
                type: 'book',
                url: 'https://use-the-index-luke.com/',
                description: 'Deep dive into SQL performance and indexing'
              }
            ]
          }
        },
        {
          id: 'auth-security',
          title: 'Authentication & Security',
          description: 'Implement robust authentication, authorization, and security measures to protect applications and user data.',
          whatYouWillLearn: [
            'Authentication strategies and implementations',
            'Authorization and access control',
            'Security best practices and common vulnerabilities',
            'Data protection and compliance requirements'
          ],
          videos: [
            {
              title: 'JWT Authentication Tutorial',
              channel: 'Web Dev Simplified',
              url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4'
            },
            {
              title: 'Web Security Basics',
              channel: 'Hussein Nasser',
              url: 'https://www.youtube.com/watch?v=J1q1pM3K9aA'
            }
          ],
          detailedContent: {
            overview: 'Security is paramount in modern application development. This module covers comprehensive authentication and authorization strategies, security best practices, common vulnerabilities, and protection mechanisms. Learn how to implement secure authentication, protect against common attacks, and ensure compliance with security standards.',
            prerequisites: ['HTTP protocol understanding', 'Backend development basics', 'Cryptography fundamentals'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Authentication vs authorization',
              'JWT (JSON Web Tokens)',
              'OAuth 2.0 and OpenID Connect',
              'Session management',
              'Password hashing and storage',
              'OWASP Top 10 vulnerabilities',
              'SQL injection prevention',
              'XSS and CSRF protection',
              'HTTPS and TLS/SSL',
              'Security headers and CORS'
            ],
            topics: [
              {
                title: 'Authentication Strategies',
                description: 'Implement various authentication mechanisms for web applications.',
                subTopics: [
                  'Password-based authentication',
                  'JWT implementation',
                  'OAuth 2.0 flows',
                  'Session management',
                  'Multi-factor authentication (MFA)',
                  'Social authentication'
                ]
              },
              {
                title: 'Authorization & Access Control',
                description: 'Control user access to resources and actions.',
                subTopics: [
                  'Role-based access control (RBAC)',
                  'Permission-based authorization',
                  'API access control',
                  'Resource ownership',
                  'Fine-grained permissions'
                ]
              },
              {
                title: 'Common Vulnerabilities',
                description: 'Understand and protect against common security threats.',
                subTopics: [
                  'SQL injection attacks',
                  'Cross-site scripting (XSS)',
                  'Cross-site request forgery (CSRF)',
                  'Authentication bypass',
                  'Data exposure risks'
                ]
              },
              {
                title: 'Security Best Practices',
                description: 'Implement comprehensive security measures.',
                subTopics: [
                  'Secure coding practices',
                  'Input validation and sanitization',
                  'Security headers configuration',
                  'Data encryption',
                  'Security testing and auditing'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Secure Authentication System',
                description: 'Build a complete authentication system with JWT, refresh tokens, and OAuth integration.',
                difficulty: 'Intermediate'
              },
              {
                title: 'API Security Implementation',
                description: 'Implement security measures for a REST API including rate limiting, input validation, and protection against common attacks.',
                difficulty: 'Advanced'
              },
              {
                title: 'Security Audit Tool',
                description: 'Create a tool that scans web applications for common security vulnerabilities and provides remediation suggestions.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'OWASP Top 10',
                type: 'documentation',
                url: 'https://owasp.org/www-project-top-ten/',
                description: 'Most critical web application security risks'
              },
              {
                title: 'JWT.io',
                type: 'tool',
                url: 'https://jwt.io/',
                description: 'JWT introduction and debugging tools'
              },
              {
                title: 'OAuth 2.0 Specification',
                type: 'documentation',
                url: 'https://oauth.net/2/',
                description: 'Official OAuth 2.0 specification and guides'
              },
              {
                title: 'Web Security Academy',
                type: 'course',
                url: 'https://portswigger.net/web-security',
                description: 'Free web security training'
              }
            ]
          }
        },
        {
          id: 'caching-queues',
          title: 'Caching and Queues',
          description: 'Enhance application performance and reliability through strategic caching and asynchronous message processing.',
          whatYouWillLearn: [
            'Caching strategies and implementations',
            'Message queue patterns and use cases',
            'Asynchronous processing architectures',
            'System resilience and fault tolerance'
          ],
          videos: [
            {
              title: 'Redis Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=Hbt56gFj998'
            },
            {
              title: 'Message Queue Explained',
              channel: 'ByteByteGo',
              url: 'https://www.youtube.com/watch?v=oUJbuFMyBDk'
            }
          ],
          detailedContent: {
            overview: 'Caching and message queues are essential tools for building scalable, performant applications. This module covers caching strategies, in-memory data stores, message queue patterns, and asynchronous processing architectures. Learn how to improve response times, reduce database load, and create resilient systems that handle traffic spikes gracefully.',
            prerequisites: ['Backend development experience', 'Understanding of distributed systems', 'Basic data structures knowledge'],
            estimatedTime: '5-7 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Cache invalidation strategies',
              'Redis data structures and operations',
              'Distributed caching',
              'Message queue patterns',
              'Pub/Sub messaging',
              'Asynchronous processing',
              'Event-driven architecture',
              'Retry mechanisms and idempotency',
              'Dead letter queues',
              'Performance monitoring'
            ],
            topics: [
              {
                title: 'Caching Fundamentals',
                description: 'Understand caching concepts and implementation strategies.',
                subTopics: [
                  'Caching benefits and trade-offs',
                  'Cache eviction policies (LRU, LFU, TTL)',
                  'Cache invalidation strategies',
                  'Client-side vs server-side caching',
                  'CDN caching'
                ]
              },
              {
                title: 'In-Memory Data Stores',
                description: 'Master Redis and other in-memory caching solutions.',
                subTopics: [
                  'Redis data types and operations',
                  'Redis persistence and clustering',
                  'Memcached vs Redis',
                  'Cache warming and preloading',
                  'Monitoring and scaling'
                ]
              },
              {
                title: 'Message Queues',
                description: 'Implement message queuing for asynchronous processing.',
                subTopics: [
                  'Queue patterns (FIFO, priority, delay)',
                  'Message brokers (RabbitMQ, Kafka, AWS SQS)',
                  'Producer-consumer patterns',
                  'Message reliability and ordering',
                  'Dead letter queues'
                ]
              },
              {
                title: 'Resilience Patterns',
                description: 'Build resilient systems with retries and fault tolerance.',
                subTopics: [
                  'Retry strategies (exponential backoff)',
                  'Circuit breaker patterns',
                  'Bulkhead isolation',
                  'Timeout and fallback mechanisms',
                  'Health checks and monitoring'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Caching Layer Implementation',
                description: 'Implement a multi-layer caching system for a high-traffic API with Redis and cache invalidation strategies.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Asynchronous Email Service',
                description: 'Build an email processing system using message queues with retry logic and dead letter queue handling.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Real-time Analytics Pipeline',
                description: 'Create a real-time data processing pipeline using message queues, caching, and stream processing.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Redis Documentation',
                type: 'documentation',
                url: 'https://redis.io/docs/',
                description: 'Comprehensive Redis documentation'
              },
              {
                title: 'RabbitMQ Tutorials',
                type: 'documentation',
                url: 'https://www.rabbitmq.com/getstarted.html',
                description: 'Official RabbitMQ tutorials'
              },
              {
                title: 'Apache Kafka Documentation',
                type: 'documentation',
                url: 'https://kafka.apache.org/documentation/',
                description: 'Kafka streaming platform documentation'
              },
              {
                title: 'Designing Data-Intensive Applications',
                type: 'book',
                url: 'https://dataintensive.net/',
                description: 'Comprehensive guide to distributed systems'
              }
            ]
          }
        },
        {
          id: 'system-design',
          title: 'System Design',
          description: 'Design scalable, reliable, and maintainable systems that handle growth and complexity effectively.',
          whatYouWillLearn: [
            'Scalability and availability principles',
            'Distributed system architecture',
            'Performance optimization strategies',
            'System design trade-offs and decision making'
          ],
          videos: [
            {
              title: 'System Design Interview Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=m8Icp_Cid5o'
            },
            {
              title: 'Scalability and Bottlenecks',
              channel: 'ByteByteGo',
              url: 'https://www.youtube.com/watch?v=Q2kCUbY4ZWs'
            }
          ],
          detailedContent: {
            overview: 'System design is the art of making architectural decisions that balance trade-offs between scalability, reliability, maintainability, and cost. This module covers fundamental principles, architectural patterns, database design, caching strategies, and real-world system design examples. Learn to think like a system architect and design solutions that scale.',
            prerequisites: ['Backend development experience', 'Understanding of distributed systems', 'Database and networking knowledge'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Scalability (vertical vs horizontal)',
              'Availability and reliability',
              'Load balancing strategies',
              'Database replication and sharding',
              'Caching strategies',
              'Microservices vs monolith',
              'API design (REST, GraphQL, gRPC)',
              'Message queues and event-driven architecture',
              'Monitoring and observability',
              'CAP theorem and consistency models'
            ],
            topics: [
              {
                title: 'System Design Fundamentals',
                description: 'Understand core principles of scalable system design.',
                subTopics: [
                  'Scalability dimensions (scale-up, scale-out)',
                  'Availability and fault tolerance',
                  'Performance metrics (throughput, latency)',
                  'Load balancing algorithms',
                  'Caching strategies'
                ]
              },
              {
                title: 'Database Design',
                description: 'Design database architectures for scale and reliability.',
                subTopics: [
                  'SQL vs NoSQL selection',
                  'Database replication (master-slave, multi-master)',
                  'Sharding strategies',
                  'Consistency and availability trade-offs',
                  'Data migration strategies'
                ]
              },
              {
                title: 'Architectural Patterns',
                description: 'Apply proven architectural patterns to system design.',
                subTopics: [
                  'Microservices architecture',
                  'Service-oriented architecture (SOA)',
                  'Event-driven architecture',
                  'CQRS and event sourcing',
                  'Serverless and function-as-a-service'
                ]
              },
              {
                title: 'Real-World System Design',
                description: 'Design systems for common use cases and requirements.',
                subTopics: [
                  'URL shortener design',
                  'Chat system design',
                  'File storage system (like Dropbox)',
                  'Social media feed design',
                  'E-commerce platform design'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'URL Shortener Service',
                description: 'Design and implement a scalable URL shortening service with analytics and rate limiting.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Real-time Chat Application',
                description: 'Build a real-time chat system with WebSocket support, message persistence, and offline capabilities.',
                difficulty: 'Advanced'
              },
              {
                title: 'Microservices E-commerce Platform',
                description: 'Design a microservices-based e-commerce platform with services for users, products, orders, and payments.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'System Design Primer',
                type: 'article',
                url: 'https://github.com/donnemartin/system-design-primer',
                description: 'Comprehensive system design resource'
              },
              {
                title: 'The System Design Interview',
                type: 'book',
                url: 'https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1517445967',
                description: 'Essential system design interview preparation'
              },
              {
                title: 'High Scalability',
                type: 'article',
                url: 'http://highscalability.com/',
                description: 'Real-world architecture case studies'
              },
              {
                title: 'Designing Data-Intensive Applications',
                type: 'book',
                url: 'https://dataintensive.net/',
                description: 'Comprehensive guide to distributed systems'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'devops',
      technology: 'DevOps & Cloud',
      category: 'Infrastructure',
      levels: ['Fresher', 'Experienced'],
      overview: 'Automate build and deployment workflows for production cloud systems.',
      subTechnologies: [
        {
          id: 'linux-shell',
          title: 'Linux & Shell Basics',
          description: 'Master Linux command line, shell scripting, and system administration for DevOps and development workflows.',
          whatYouWillLearn: [
            'Linux command line proficiency',
            'Shell scripting and automation',
            'File system operations and permissions',
            'Process management and system monitoring'
          ],
          videos: [
            {
              title: 'Linux for Beginners',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=sWbUDq4S6Y8'
            },
            {
              title: 'Bash Scripting Tutorial',
              channel: 'NetworkChuck',
              url: 'https://www.youtube.com/watch?v=SPwyp2NG-bE'
            }
          ],
          detailedContent: {
            overview: 'Linux and shell scripting are essential skills for DevOps, system administration, and development. This module covers Linux fundamentals, command line operations, shell scripting, process management, and system monitoring. Learn to navigate and manage Linux systems efficiently, automate tasks with scripts, and troubleshoot common issues.',
            prerequisites: ['Basic computer literacy', 'Understanding of operating systems', 'Text editor familiarity'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'Linux file system hierarchy',
              'Command line navigation and operations',
              'File permissions and ownership',
              'Shell scripting (Bash)',
              'Process management and monitoring',
              'Text processing (grep, sed, awk)',
              'System administration commands',
              'Networking commands and tools',
              'Package management',
              'Log files and troubleshooting'
            ],
            topics: [
              {
                title: 'Linux Fundamentals',
                description: 'Master essential Linux command line skills.',
                subTopics: [
                  'File system navigation (cd, ls, pwd)',
                  'File and directory operations',
                  'Text file viewing and editing',
                  'Search and pattern matching',
                  'Command piping and redirection'
                ]
              },
              {
                title: 'File Permissions & Management',
                description: 'Understand and manage file permissions and ownership.',
                subTopics: [
                  'Permission system (rwx)',
                  'Changing permissions (chmod, chown)',
                  'User and group management',
                  'Special permissions (setuid, setgid, sticky bit)',
                  'Access control lists (ACL)'
                ]
              },
              {
                title: 'Shell Scripting',
                description: 'Automate tasks with shell scripts.',
                subTopics: [
                  'Script structure and execution',
                  'Variables and data types',
                  'Control flow (if/else, loops)',
                  'Functions and parameters',
                  'Error handling and debugging'
                ]
              },
              {
                title: 'Process Management',
                description: 'Monitor and control system processes.',
                subTopics: [
                  'Process viewing (ps, top, htop)',
                  'Process control (kill, pkill, nice)',
                  'Background and foreground processes',
                  'Service management (systemd)',
                  'Resource monitoring'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'System Monitoring Script',
                description: 'Create a bash script that monitors system resources (CPU, memory, disk) and sends alerts when thresholds are exceeded.',
                difficulty: 'Beginner'
              },
              {
                title: 'Log Analysis Tool',
                description: 'Build a tool to analyze server logs, extract statistics, and generate reports.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Automated Backup System',
                description: 'Develop a comprehensive backup system with scheduling, compression, and remote storage support.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'Linux Journey',
                type: 'course',
                url: 'https://linuxjourney.com/',
                description: 'Interactive Linux learning platform'
              },
              {
                title: 'Bash Guide for Beginners',
                type: 'documentation',
                url: 'https://tldp.org/LDP/Bash-Beginners-Guide/html/',
                description: 'Comprehensive bash scripting guide'
              },
              {
                title: 'Linux Command Library',
                type: 'tool',
                url: 'https://www.linux.org/docs/',
                description: 'Complete Linux command reference'
              }
            ]
          }
        },
        {
          id: 'docker',
          title: 'Docker',
          description: 'Containerize applications and standardize deployment across different environments using Docker.',
          whatYouWillLearn: [
            'Docker fundamentals and containerization',
            'Dockerfile creation and optimization',
            'Docker Compose for multi-container applications',
            'Docker networking and storage'
          ],
          videos: [
            {
              title: 'Docker Full Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=3c-iBn73dDE'
            },
            {
              title: 'Docker Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo'
            }
          ],
          detailedContent: {
            overview: 'Docker has revolutionized application deployment through containerization. This module covers Docker fundamentals, container creation and management, Dockerfile best practices, multi-container applications with Docker Compose, and production deployment strategies. Learn to package applications consistently across development, testing, and production environments.',
            prerequisites: ['Linux command line basics', 'Understanding of application architecture', 'Basic networking concepts'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Containerization vs virtualization',
              'Docker architecture (daemon, CLI, registry)',
              'Images and containers lifecycle',
              'Dockerfile syntax and best practices',
              'Multi-stage builds',
              'Docker networking (bridge, host, overlay)',
              'Volume management and data persistence',
              'Docker Compose orchestration',
              'Container optimization and security',
              'CI/CD integration'
            ],
            topics: [
              {
                title: 'Docker Fundamentals',
                description: 'Understand Docker architecture and containerization concepts.',
                subTopics: [
                  'Container vs virtual machine',
                  'Docker installation and setup',
                  'Running basic containers',
                  'Managing containers lifecycle',
                  'Docker images and layers'
                ]
              },
              {
                title: 'Building Images',
                description: 'Create optimized Docker images using Dockerfiles.',
                subTopics: [
                  'Dockerfile syntax and instructions',
                  'Base image selection',
                  'Multi-stage builds',
                  'Image optimization techniques',
                  'Security scanning and vulnerability detection'
                ]
              },
              {
                title: 'Docker Compose',
                description: 'Orchestrate multi-container applications.',
                subTopics: [
                  'Compose file syntax',
                  'Service definition and configuration',
                  'Networking in Compose',
                  'Volume management',
                  'Environment variables and configuration'
                ]
              },
              {
                title: 'Production Docker',
                description: 'Deploy Docker containers in production environments.',
                subTopics: [
                  'Container registry management',
                  'Container orchestration basics',
                  'Monitoring and logging',
                  'Security best practices',
                  'Performance optimization'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Multi-tier Web Application',
                description: 'Containerize a web application with frontend, backend, and database using Docker Compose.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Development Environment Setup',
                description: 'Create a reproducible development environment with multiple services and tooling.',
                difficulty: 'Beginner'
              },
              {
                title: 'Production Deployment Pipeline',
                description: 'Build a complete CI/CD pipeline for building, testing, and deploying Docker containers.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Docker Documentation',
                type: 'documentation',
                url: 'https://docs.docker.com/',
                description: 'Official Docker documentation'
              },
              {
                title: 'Dockerfile Best Practices',
                type: 'article',
                url: 'https://docs.docker.com/develop/dev-best-practices/',
                description: 'Official Docker best practices guide'
              },
              {
                title: 'Docker Hub',
                type: 'tool',
                url: 'https://hub.docker.com/',
                description: 'Container image registry and discovery'
              }
            ]
          }
        },
        {
          id: 'kubernetes',
          title: 'Kubernetes',
          description: 'Orchestrate containerized applications at scale using Kubernetes container management platform.',
          whatYouWillLearn: [
            'Kubernetes architecture and core concepts',
            'Deployment and scaling strategies',
            'Service discovery and networking',
            'Configuration management and secrets'
          ],
          videos: [
            {
              title: 'Kubernetes Crash Course',
              channel: 'TechWorld with Nana',
              url: 'https://www.youtube.com/watch?v=X48VuDVv0do'
            },
            {
              title: 'Kubernetes for Beginners',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=d6WC5n9G_sM'
            }
          ],
          detailedContent: {
            overview: 'Kubernetes is the leading container orchestration platform for automating deployment, scaling, and management of containerized applications. This module covers Kubernetes architecture, core concepts, application deployment, scaling strategies, networking, storage, and production operations. Learn to build and manage scalable, resilient containerized applications.',
            prerequisites: ['Docker fundamentals', 'Linux command line proficiency', 'Understanding of microservices'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Kubernetes architecture (control plane, nodes)',
              'Pods and containers',
              'Deployments and ReplicaSets',
              'Services and service discovery',
              'Ingress and load balancing',
              'ConfigMaps and Secrets',
              'Persistent volumes and storage',
              'Namespaces and resource quotas',
              'Rolling updates and rollbacks',
              'Monitoring and troubleshooting'
            ],
            topics: [
              {
                title: 'Kubernetes Fundamentals',
                description: 'Master Kubernetes architecture and core concepts.',
                subTopics: [
                  'Cluster setup and components',
                  'Pod lifecycle management',
                  'Controllers (ReplicaSet, Deployment)',
                  'Service types (ClusterIP, NodePort, LoadBalancer)',
                  'kubectl commands and usage'
                ]
              },
              {
                title: 'Application Deployment',
                description: 'Deploy and manage applications on Kubernetes.',
                subTopics: [
                  'Deployment strategies',
                  'Rolling updates and rollbacks',
                  'Health checks and probes',
                  'Resource limits and requests',
                  'Horizontal Pod Autoscaling'
                ]
              },
              {
                title: 'Networking & Storage',
                description: 'Configure networking and persistent storage.',
                subTopics: [
                  'Cluster networking fundamentals',
                  'Ingress controllers',
                  'Network policies',
                  'Persistent volumes and claims',
                  'Storage classes'
                ]
              },
              {
                title: 'Configuration & Security',
                description: 'Manage application configuration and security.',
                subTopics: [
                  'ConfigMaps for configuration',
                  'Secrets management',
                  'Service accounts and RBAC',
                  'Security contexts and pod security',
                  'Image security policies'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Microservices Deployment',
                description: 'Deploy a microservices application with frontend, backend, and database on Kubernetes.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Auto-scaling Application',
                description: 'Build an application that automatically scales based on traffic using HPA and metrics.',
                difficulty: 'Advanced'
              },
              {
                title: 'Multi-environment Setup',
                description: 'Create Kubernetes configurations for development, staging, and production environments.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Kubernetes Documentation',
                type: 'documentation',
                url: 'https://kubernetes.io/docs/',
                description: 'Official Kubernetes documentation'
              },
              {
                title: 'Kubernetes.io tutorials',
                type: 'course',
                url: 'https://kubernetes.io/docs/tutorials/',
                description: 'Interactive Kubernetes tutorials'
              },
              {
                title: 'CNCF Kubernetes Training',
                type: 'course',
                url: 'https://www.cncf.io/certification/training/',
                description: 'Official CNCF Kubernetes training'
              }
            ]
          }
        },
        {
          id: 'cicd',
          title: 'CI/CD Pipelines',
          description: 'Automate the software delivery process with continuous integration and continuous deployment pipelines.',
          whatYouWillLearn: [
            'CI/CD principles and workflows',
            'Pipeline design and implementation',
            'Automated testing and quality gates',
            'Deployment strategies and rollback procedures'
          ],
          videos: [
            {
              title: 'CI/CD Explained',
              channel: 'TechWorld with Nana',
              url: 'https://www.youtube.com/watch?v=scEDHsr3APg'
            },
            {
              title: 'GitHub Actions Tutorial',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=R8_veQiYBjI'
            }
          ],
          detailedContent: {
            overview: 'CI/CD pipelines automate the process of integrating code changes, running tests, and deploying applications. This module covers continuous integration, continuous deployment, pipeline design, testing automation, and deployment strategies. Learn to build efficient pipelines that improve code quality, reduce deployment time, and enable frequent releases.',
            prerequisites: ['Version control (Git)', 'Understanding of software development lifecycle', 'Basic scripting knowledge'],
            estimatedTime: '5-7 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Continuous integration principles',
              'Continuous deployment vs delivery',
              'Pipeline stages and workflows',
              'Automated testing strategies',
              'Code quality gates',
              'Deployment strategies (blue-green, canary)',
              'Infrastructure as code',
              'Pipeline security and secrets management',
              'Monitoring and feedback loops',
              'Rollback and recovery procedures'
            ],
            topics: [
              {
                title: 'CI Fundamentals',
                description: 'Understand and implement continuous integration practices.',
                subTopics: [
                  'Automated build processes',
                  'Automated testing integration',
                  'Code quality checks',
                  'Branching strategies',
                  'Merge request automation'
                ]
              },
              {
                title: 'CD Fundamentals',
                description: 'Implement continuous deployment and delivery.',
                subTopics: [
                  'Automated deployment processes',
                  'Environment management',
                  'Deployment strategies',
                  'Rollback procedures',
                  'Zero-downtime deployments'
                ]
              },
              {
                title: 'Pipeline Tools',
                description: 'Master popular CI/CD tools and platforms.',
                subTopics: [
                  'Jenkins pipelines',
                  'GitHub Actions',
                  'GitLab CI/CD',
                  'Azure DevOps',
                  'Cloud-native CI/CD'
                ]
              },
              {
                title: 'Infrastructure as Code',
                description: 'Manage infrastructure through code and automation.',
                subTopics: [
                  'Terraform fundamentals',
                  'Ansible automation',
                  'CloudFormation templates',
                  'Configuration management',
                  'Immutable infrastructure'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Complete CI/CD Pipeline',
                description: 'Build a full CI/CD pipeline for a web application with testing, security scanning, and deployment.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Multi-environment Deployment',
                description: 'Create automated deployment pipelines for development, staging, and production environments.',
                difficulty: 'Advanced'
              },
              {
                title: 'Infrastructure Automation',
                description: 'Implement infrastructure as code to provision and manage cloud resources automatically.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Jenkins Documentation',
                type: 'documentation',
                url: 'https://www.jenkins.io/doc/',
                description: 'Official Jenkins documentation'
              },
              {
                title: 'GitHub Actions Documentation',
                type: 'documentation',
                url: 'https://docs.github.com/en/actions',
                description: 'GitHub Actions guides and reference'
              },
              {
                title: 'Terraform Documentation',
                type: 'documentation',
                url: 'https://www.terraform.io/docs',
                description: 'Infrastructure as code documentation'
              },
              {
                title: 'Continuous Delivery',
                type: 'book',
                url: 'https://continuousdelivery.com/',
                description: 'CI/CD fundamentals and best practices'
              }
            ]
          }
        },
        {
          id: 'cloud-observability',
          title: 'Cloud & Observability',
          description: 'Monitor, debug, and optimize cloud applications using comprehensive observability practices and cloud services.',
          whatYouWillLearn: [
            'Cloud computing fundamentals and services',
            'Observability pillars (logs, metrics, traces)',
            'Monitoring and alerting strategies',
            'Cloud cost optimization and management'
          ],
          videos: [
            {
              title: 'Monitoring and Observability Basics',
              channel: 'Grafana',
              url: 'https://www.youtube.com/watch?v=K9f2J2S5Vf8'
            },
            {
              title: 'Cloud Fundamentals',
              channel: 'TechWorld with Nana',
              url: 'https://www.youtube.com/watch?v=2LaAJq1lB1Q'
            }
          ],
          detailedContent: {
            overview: 'Cloud observability combines cloud computing knowledge with comprehensive monitoring practices. This module covers cloud fundamentals, major cloud providers, observability pillars (logs, metrics, distributed tracing), monitoring tools, alerting strategies, and cost optimization. Learn to build and maintain healthy cloud applications with full visibility into their performance and behavior.',
            prerequisites: ['Linux system administration', 'Understanding of distributed systems', 'Networking fundamentals'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Cloud service models (IaaS, PaaS, SaaS)',
              'AWS, Azure, and Google Cloud services',
              'Observability vs monitoring',
              'Logs aggregation and analysis',
              'Metrics collection and visualization',
              'Distributed tracing',
              'Alert design and incident response',
              'SLA/SLO/SLI concepts',
              'Cloud cost management',
              'Security and compliance in cloud'
            ],
            topics: [
              {
                title: 'Cloud Fundamentals',
                description: 'Understand cloud computing concepts and services.',
                subTopics: [
                  'Cloud deployment models',
                  'Major cloud providers comparison',
                  'Compute services (EC2, VM, Cloud Functions)',
                  'Storage services',
                  'Networking and CDN'
                ]
              },
              {
                title: 'Observability Pillars',
                description: 'Implement the three pillars of observability.',
                subTopics: [
                  'Logging strategies and tools (ELK, CloudWatch)',
                  'Metrics collection and dashboards (Prometheus, Grafana)',
                  'Distributed tracing (Jaeger, Zipkin)',
                  'Correlation and analysis'
                ]
              },
              {
                title: 'Monitoring & Alerting',
                description: 'Set up effective monitoring and alerting systems.',
                subTopics: [
                  'Alert design principles',
                  'Incident response workflows',
                  'On-call rotation and escalation',
                  'Synthetic monitoring',
                  'Real user monitoring (RUM)'
                ]
              },
              {
                title: 'Cloud Optimization',
                description: 'Optimize cloud costs and performance.',
                subTopics: [
                  'Cost monitoring and analysis',
                  'Resource optimization strategies',
                  'Reserved instances and savings plans',
                  'Performance tuning',
                  'FinOps best practices'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Cloud Monitoring Dashboard',
                description: 'Build a comprehensive monitoring dashboard with metrics, logs, and alerts for a cloud application.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Cost Optimization System',
                description: 'Create a system to monitor, analyze, and optimize cloud infrastructure costs.',
                difficulty: 'Advanced'
              },
              {
                title: 'Observability Platform',
                description: 'Deploy and configure a complete observability stack with logs, metrics, and tracing.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'AWS Documentation',
                type: 'documentation',
                url: 'https://docs.aws.amazon.com/',
                description: 'Comprehensive AWS documentation'
              },
              {
                title: 'Prometheus Documentation',
                type: 'documentation',
                url: 'https://prometheus.io/docs/',
                description: 'Monitoring system documentation'
              },
              {
                title: 'Grafana Documentation',
                type: 'documentation',
                url: 'https://grafana.com/docs/',
                description: 'Visualization and analytics platform'
              },
              {
                title: 'Google SRE Book',
                type: 'book',
                url: 'https://sre.google/sre-book/',
                description: 'Site Reliability Engineering practices'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'mobile',
      technology: 'Mobile Development',
      category: 'App',
      levels: ['Fresher', 'Experienced'],
      overview: 'Develop smooth mobile apps with scalable architecture and release readiness.',
      subTechnologies: [
        {
          id: 'mobile-ui',
          title: 'Mobile UI Foundations',
          description: 'Design intuitive and responsive mobile user interfaces with adaptive layouts and consistent navigation patterns.',
          whatYouWillLearn: [
            'Mobile design principles and patterns',
            'Responsive layouts and adaptive design',
            'Navigation and interaction patterns',
            'Performance-optimized UI components'
          ],
          videos: [
            {
              title: 'Mobile App Design Principles',
              channel: 'DesignCourse',
              url: 'https://www.youtube.com/watch?v=Q8r6t5D7n9U'
            },
            {
              title: 'UI/UX for Developers',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU'
            }
          ],
          detailedContent: {
            overview: 'Mobile UI design requires understanding of touch interfaces, limited screen real estate, and platform-specific conventions. This module covers mobile design principles, responsive layouts, navigation patterns, and performance optimization for mobile interfaces. Learn to create intuitive, efficient, and visually appealing mobile user experiences.',
            prerequisites: ['UI/UX fundamentals', 'Understanding of mobile platforms', 'Basic design principles'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'Mobile design principles and constraints',
              'Responsive and adaptive layouts',
              'Touch interface design',
              'Platform-specific guidelines (iOS, Android)',
              'Navigation patterns',
              'Component libraries and design systems',
              'Performance optimization',
              'Accessibility for mobile',
              'Gesture interactions',
              'Animation and micro-interactions'
            ],
            topics: [
              {
                title: 'Mobile Design Fundamentals',
                description: 'Master mobile design principles and best practices.',
                subTopics: [
                  'Mobile vs desktop design differences',
                  'Touch targets and spacing',
                  'Typography and readability',
                  'Color and contrast',
                  'Platform guidelines (Human Interface, Material Design)'
                ]
              },
              {
                title: 'Layout & Responsive Design',
                description: 'Create adaptive layouts for various screen sizes.',
                subTopics: [
                  'Responsive design principles',
                  'Flexible layouts and grids',
                  'Adaptive design patterns',
                  'Orientation handling',
                  'Safe areas and notches'
                ]
              },
              {
                title: 'Navigation Patterns',
                description: 'Implement intuitive navigation structures.',
                subTopics: [
                  'Navigation hierarchies',
                  'Bottom navigation patterns',
                  'Tab bars and navigation controllers',
                  'Modal and sheet presentations',
                  'Gesture-based navigation'
                ]
              },
              {
                title: 'Performance & Optimization',
                description: 'Optimize UI performance for mobile devices.',
                subTopics: [
                  'Rendering optimization',
                  'Image and asset optimization',
                  'Animation performance',
                  'Memory management',
                  'Battery optimization'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Mobile App UI Kit',
                description: 'Create a comprehensive UI kit with reusable components for mobile applications.',
                difficulty: 'Beginner'
              },
              {
                title: 'Responsive Mobile Layout',
                description: 'Design and implement a responsive mobile layout that adapts to different screen sizes and orientations.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Mobile Design System',
                description: 'Build a complete mobile design system with components, guidelines, and documentation.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Apple Human Interface Guidelines',
                type: 'documentation',
                url: 'https://developer.apple.com/design/human-interface-guidelines/',
                description: 'Official iOS design guidelines'
              },
              {
                title: 'Material Design',
                type: 'documentation',
                url: 'https://material.io/design',
                description: 'Google\'s material design system'
              },
              {
                title: 'Mobile Design Patterns',
                type: 'article',
                url: 'https://mobbin.com/',
                description: 'Collection of mobile app design patterns'
              }
            ]
          }
        },
        {
          id: 'flutter',
          title: 'Flutter Development',
          description: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase using Flutter.',
          whatYouWillLearn: [
            'Flutter framework and widget system',
            'State management approaches',
            'Navigation and routing',
            'Platform-specific features and plugins'
          ],
          videos: [
            {
              title: 'Flutter Beginner Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=VPvVD8t02U8'
            },
            {
              title: 'Flutter Roadmap',
              channel: 'Flutter',
              url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU'
            }
          ],
          detailedContent: {
            overview: 'Flutter is Google\'s UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. This module covers Flutter fundamentals, widget composition, state management, navigation, platform integration, and performance optimization. Learn to create beautiful, high-performance apps with expressive and flexible UI.',
            prerequisites: ['Dart programming language', 'Understanding of mobile development', 'Object-oriented programming concepts'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Flutter architecture and widget tree',
              'State vs immutable widgets',
              'Widget composition and reuse',
              'State management (Provider, Riverpod, BLoC)',
              'Navigation and routing',
              'Platform channels and native integration',
              'Animation and gestures',
              'Internationalization and localization',
              'Testing (widget, integration, unit)',
              'Performance optimization'
            ],
            topics: [
              {
                title: 'Flutter Fundamentals',
                description: 'Master Flutter architecture and widget system.',
                subTopics: [
                  'Flutter architecture overview',
                  'Dart programming basics',
                  'Widget tree and composition',
                  'Layout widgets',
                  'Material and Cupertino widgets'
                ]
              },
              {
                title: 'State Management',
                description: 'Implement effective state management solutions.',
                subTopics: [
                  'State management approaches',
                  'Provider pattern',
                  'Riverpod state management',
                  'BLoC pattern',
                  'Redux and mobx alternatives'
                ]
              },
              {
                title: 'Navigation & Routing',
                description: 'Implement complex navigation flows.',
                subTopics: [
                  'Basic navigation and routes',
                  'Navigator 2.0 API',
                  'Deep linking',
                  'Route guards',
                  'Tab and bottom navigation'
                ]
              },
              {
                title: 'Platform Integration',
                description: 'Integrate with native platform features.',
                subTopics: [
                  'Platform channels',
                  'Plugin development',
                  'Permissions and sensors',
                  'Native views embedding',
                  'Platform-specific APIs'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Task Management App',
                description: 'Build a complete task management app with CRUD operations, state management, and local storage.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Weather Application',
                description: 'Create a weather app with location services, API integration, and beautiful UI animations.',
                difficulty: 'Intermediate'
              },
              {
                title: 'E-commerce Mobile App',
                description: 'Develop a full-featured e-commerce app with product catalog, cart, and checkout functionality.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Flutter Documentation',
                type: 'documentation',
                url: 'https://flutter.dev/docs',
                description: 'Official Flutter documentation'
              },
              {
                title: 'Flutter Catalog',
                type: 'tool',
                url: 'https://flutter.github.io/catalog/',
                description: 'Flutter widget examples and recipes'
              },
              {
                title: 'Flutter.dev Codelabs',
                type: 'course',
                url: 'https://flutter.dev/docs/codelabs',
                description: 'Interactive Flutter tutorials'
              }
            ]
          }
        },
        {
          id: 'react-native',
          title: 'React Native',
          description: 'Build native mobile applications using React and JavaScript with React Native framework.',
          whatYouWillLearn: [
            'React Native fundamentals and components',
            'Navigation and routing libraries',
            'Platform-specific code and optimizations',
            'State management and API integration'
          ],
          videos: [
            {
              title: 'React Native Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc'
            },
            {
              title: 'React Native Crash Course',
              channel: 'Traversy Media',
              url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8'
            }
          ],
          detailedContent: {
            overview: 'React Native enables building native mobile applications using React and JavaScript. This module covers React Native fundamentals, core components, navigation, platform-specific development, state management, and performance optimization. Learn to create cross-platform mobile apps with native performance while maintaining code sharing across iOS and Android.',
            prerequisites: ['React fundamentals', 'JavaScript/TypeScript', 'Understanding of mobile development'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'React Native architecture and bridge',
              'Core components and APIs',
              'Styling and flexbox layout',
              'Navigation libraries (React Navigation)',
              'State management (Redux, Context, MobX)',
              'Platform-specific code',
              'Native modules and native UI components',
              'Performance profiling and optimization',
              'Testing (unit, integration, E2E)',
              'App distribution and deployment'
            ],
            topics: [
              {
                title: 'React Native Fundamentals',
                description: 'Master React Native core concepts and components.',
                subTopics: [
                  'React Native architecture',
                  'Core components (View, Text, Image)',
                  'Styling with flexbox',
                  'Handling user input',
                  'Platform APIs and permissions'
                ]
              },
              {
                title: 'Navigation',
                description: 'Implement complex navigation patterns.',
                subTopics: [
                  'React Navigation setup',
                  'Stack navigation',
                  'Tab navigation',
                  'Drawer navigation',
                  'Deep linking and navigation params'
                ]
              },
              {
                title: 'State Management',
                description: 'Choose and implement state management solutions.',
                subTopics: [
                  'Context API for state',
                  'Redux and Redux Toolkit',
                  'MobX for reactive state',
                  'Zustand as lightweight alternative',
                  'Data fetching with React Query'
                ]
              },
              {
                title: 'Platform Integration',
                description: 'Integrate with platform-specific features.',
                subTopics: [
                  'Platform-specific code',
                  'Native modules',
                  'Camera and media handling',
                  'Push notifications',
                  'Device hardware access'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Fitness Tracking App',
                description: 'Build a fitness tracking app with step counting, workout logging, and progress visualization.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Social Media Feed',
                description: 'Create a social media app with posts, comments, likes, and real-time updates.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Productivity Application',
                description: 'Develop a comprehensive productivity app with tasks, calendar, notes, and synchronization.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'React Native Documentation',
                type: 'documentation',
                url: 'https://reactnative.dev/docs/getting-started',
                description: 'Official React Native documentation'
              },
              {
                title: 'React Navigation',
                type: 'documentation',
                url: 'https://reactnavigation.org/docs/getting-started',
                description: 'Navigation library documentation'
              },
              {
                title: 'React Native Elements',
                type: 'tool',
                url: 'https://reactnativeelements.com/',
                description: 'Cross-platform UI toolkit'
              }
            ]
          }
        },
        {
          id: 'state-offline',
          title: 'State Management & Offline',
          description: 'Implement robust state management and offline capabilities for mobile applications.',
          whatYouWillLearn: [
            'State management architectures and patterns',
            'Local data persistence strategies',
            'Offline-first design principles',
            'Data synchronization and conflict resolution'
          ],
          videos: [
            {
              title: 'State Management in Mobile Apps',
              channel: 'Coding with Andrea',
              url: 'https://www.youtube.com/watch?v=3tm-R7ymwhc'
            },
            {
              title: 'Offline-first Apps Explained',
              channel: 'Google Developers',
              url: 'https://www.youtube.com/watch?v=qDJz4JQ6CMA'
            }
          ],
          detailedContent: {
            overview: 'Effective state management and offline capabilities are crucial for mobile app reliability and user experience. This module covers state management patterns, local storage solutions, offline-first architecture, data synchronization, and conflict resolution. Learn to build mobile apps that work seamlessly regardless of network conditions.',
            prerequisites: ['Mobile development fundamentals', 'Understanding of async programming', 'API integration experience'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'State management patterns (Redux, BLoC, Provider)',
              'Local storage solutions (SQLite, Realm, SharedPreferences)',
              'Offline-first architecture',
              'Data synchronization strategies',
              'Conflict resolution mechanisms',
              'Network awareness and connectivity',
              'Background sync and push notifications',
              'Data caching strategies',
              'State persistence and recovery',
              'Error handling and retry logic'
            ],
            topics: [
              {
                title: 'State Management',
                description: 'Implement scalable state management solutions.',
                subTopics: [
                  'State management architectures',
                  'Unidirectional data flow',
                  'Reactive state management',
                  'State normalization',
                  'Performance optimization'
                ]
              },
              {
                title: 'Local Persistence',
                description: 'Choose and implement local storage solutions.',
                subTopics: [
                  'SQLite database integration',
                  'NoSQL databases (Realm, Firebase)',
                  'Key-value storage',
                  'File system usage',
                  'Data encryption and security'
                ]
              },
              {
                title: 'Offline Architecture',
                description: 'Design offline-first mobile applications.',
                subTopics: [
                  'Offline-first design principles',
                  'Network-aware UI',
                  'Queue and retry mechanisms',
                  'Optimistic UI updates',
                  'Graceful degradation'
                ]
              },
              {
                title: 'Data Synchronization',
                description: 'Implement reliable data synchronization.',
                subTopics: [
                  'Sync strategies (full, incremental, real-time)',
                  'Conflict resolution',
                  'Background synchronization',
                  'Delta updates',
                  'Sync status and feedback'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Offline-first Note Taking App',
                description: 'Build a note-taking app that works offline with automatic synchronization when connectivity is restored.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Real-time Collaboration App',
                description: 'Create a collaboration app with offline support, real-time updates, and conflict resolution.',
                difficulty: 'Advanced'
              },
              {
                title: 'Inventory Management System',
                description: 'Develop an inventory system with offline mode, background sync, and data conflict resolution.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Offline First',
                type: 'article',
                url: 'https://offlinefirst.org/',
                description: 'Offline-first development resources'
              },
              {
                title: 'Redux Documentation',
                type: 'documentation',
                url: 'https://redux.js.org/',
                description: 'State management library documentation'
              },
              {
                title: 'Firebase Offline Capabilities',
                type: 'documentation',
                url: 'https://firebase.google.com/docs/firestore/manage-data/enable-offline',
                description: 'Firebase offline features documentation'
              }
            ]
          }
        },
        {
          id: 'release-monitoring',
          title: 'Release & Monitoring',
          description: 'Deploy mobile applications to app stores and implement comprehensive monitoring and analytics.',
          whatYouWillLearn: [
            'App store submission and release processes',
            'Build configuration and signing',
            'Crash reporting and analytics',
            'Performance monitoring and user feedback'
          ],
          videos: [
            {
              title: 'Publishing Apps Guide',
              channel: 'Flutter',
              url: 'https://www.youtube.com/watch?v=BrM0h4zgyR0'
            },
            {
              title: 'Mobile App Monitoring Basics',
              channel: 'Firebase',
              url: 'https://www.youtube.com/watch?v=H2rI8QYkQ9M'
            }
          ],
          detailedContent: {
            overview: 'Releasing mobile applications involves build processes, app store submissions, and ongoing monitoring. This module covers release management, build configuration, app store optimization, crash reporting, analytics, and performance monitoring. Learn to successfully publish and maintain mobile applications with visibility into their performance and user experience.',
            prerequisites: ['Mobile app development experience', 'Understanding of CI/CD', 'Basic analytics concepts'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'App store submission processes',
              'Build configurations and signing',
              'Version management and release strategies',
              'Crash reporting and debugging',
              'Analytics and user behavior tracking',
              'Performance monitoring',
              'App store optimization (ASO)',
              'A/B testing and feature flags',
              'User feedback and reviews management',
              'Compliance and security requirements'
            ],
            topics: [
              {
                title: 'Build & Release Management',
                description: 'Manage build configurations and release processes.',
                subTopics: [
                  'Build configurations (debug, release, staging)',
                  'Code signing and certificates',
                  'App store submission (iOS, Android)',
                  'Version management',
                  'Automated release pipelines'
                ]
              },
              {
                title: 'App Store Optimization',
                description: 'Optimize app store presence and discoverability.',
                subTopics: [
                  'App store listing optimization',
                  'Keywords and metadata',
                  'Screenshots and preview videos',
                  'Ratings and reviews management',
                  'Localization strategies'
                ]
              },
              {
                title: 'Crash Reporting & Debugging',
                description: 'Implement crash reporting and debugging tools.',
                subTopics: [
                  'Crash reporting services (Firebase Crashlytics, Sentry)',
                  'Error tracking and analysis',
                  'Debugging production issues',
                  'Symbolication and stack traces',
                  'Error reproduction and resolution'
                ]
              },
              {
                title: 'Analytics & Monitoring',
                description: 'Track app performance and user behavior.',
                subTopics: [
                  'Analytics implementation (Firebase Analytics, Mixpanel)',
                  'User behavior tracking',
                  'Performance monitoring',
                  'Custom events and funnels',
                  'Data privacy and compliance'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'App Store Launch',
                description: 'Complete the entire app store submission process for a mobile application.',
                difficulty: 'Beginner'
              },
              {
                title: 'Monitoring Dashboard',
                description: 'Build a comprehensive monitoring dashboard tracking app performance, crashes, and user metrics.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Automated Release Pipeline',
                description: 'Create an automated pipeline for building, testing, and releasing mobile applications.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'App Store Connect Documentation',
                type: 'documentation',
                url: 'https://developer.apple.com/documentation/appstoreconnect',
                description: 'Apple app store management documentation'
              },
              {
                title: 'Google Play Console',
                type: 'documentation',
                url: 'https://support.google.com/googleplay/android-developer/',
                description: 'Google Play developer documentation'
              },
              {
                title: 'Firebase Crashlytics',
                type: 'tool',
                url: 'https://firebase.google.com/products/crashlytics',
                description: 'Crash reporting service'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'aiml',
      technology: 'AI & Machine Learning',
      category: 'Data',
      levels: ['Fresher', 'Experienced'],
      overview: 'Build data-driven models and deploy practical machine learning solutions.',
      subTechnologies: [
        {
          id: 'math-foundations',
          title: 'Math & Data Foundations',
          description: 'Build the mathematical foundation for machine learning with statistics, linear algebra, and data preprocessing.',
          whatYouWillLearn: [
            'Probability and statistics fundamentals',
            'Linear algebra for machine learning',
            'Data preprocessing and feature engineering',
            'Exploratory data analysis techniques'
          ],
          videos: [
            {
              title: 'Statistics for Machine Learning',
              channel: 'StatQuest',
              url: 'https://www.youtube.com/watch?v=xxpc-HPKN28'
            },
            {
              title: 'Data Preprocessing Tutorial',
              channel: 'Krish Naik',
              url: 'https://www.youtube.com/watch?v=0A6PmyR9hY0'
            }
          ],
          detailedContent: {
            overview: 'Mathematical foundations are essential for understanding machine learning algorithms and effectively working with data. This module covers probability, statistics, linear algebra, calculus concepts, and data preprocessing techniques. Learn to prepare data effectively, understand algorithm behavior, and perform exploratory data analysis.',
            prerequisites: ['Basic algebra', 'Understanding of functions', 'Basic programming skills'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Probability theory and distributions',
              'Statistical inference and hypothesis testing',
              'Linear algebra (vectors, matrices, operations)',
              'Calculus for optimization',
              'Data cleaning and preprocessing',
              'Feature engineering and selection',
              'Exploratory data analysis',
              'Data visualization techniques',
              'Handling missing and noisy data',
              'Data scaling and normalization'
            ],
            topics: [
              {
                title: 'Statistics & Probability',
                description: 'Master statistical concepts and probability theory.',
                subTopics: [
                  'Descriptive statistics',
                  'Probability distributions',
                  'Hypothesis testing',
                  'Confidence intervals',
                  'Bayesian probability'
                ]
              },
              {
                title: 'Linear Algebra',
                description: 'Understand linear algebra for machine learning.',
                subTopics: [
                  'Vectors and vector operations',
                  'Matrices and matrix operations',
                  'Eigenvalues and eigenvectors',
                  'Matrix factorization',
                  'Geometric interpretations'
                ]
              },
              {
                title: 'Data Preprocessing',
                description: 'Clean and prepare data for machine learning.',
                subTopics: [
                  'Data cleaning techniques',
                  'Handling missing values',
                  'Feature scaling and normalization',
                  'Encoding categorical variables',
                  'Feature selection methods'
                ]
              },
              {
                title: 'Exploratory Data Analysis',
                description: 'Explore and understand datasets effectively.',
                subTopics: [
                  'Data visualization techniques',
                  'Statistical analysis',
                  'Pattern recognition',
                  'Outlier detection',
                  'Data storytelling'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Data Analysis Portfolio',
                description: 'Perform comprehensive exploratory data analysis on multiple real-world datasets with visualization.',
                difficulty: 'Beginner'
              },
              {
                title: 'Feature Engineering Pipeline',
                description: 'Build an automated pipeline for data preprocessing, feature engineering, and feature selection.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Statistical Analysis Tool',
                description: 'Create a tool for statistical analysis and hypothesis testing with interactive visualizations.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'Statistics 110',
                type: 'course',
                url: 'https://www.stat110.net/',
                description: 'Comprehensive statistics course'
              },
              {
                title: 'Khan Academy Linear Algebra',
                type: 'course',
                url: 'https://www.khanacademy.org/math/linear-algebra',
                description: 'Linear algebra fundamentals'
              },
              {
                title: 'Pandas Documentation',
                type: 'documentation',
                url: 'https://pandas.pydata.org/docs/',
                description: 'Data manipulation library documentation'
              }
            ]
          }
        },
        {
          id: 'ml-basics',
          title: 'ML Fundamentals',
          description: 'Master fundamental machine learning algorithms and techniques for supervised and unsupervised learning.',
          whatYouWillLearn: [
            'Supervised learning algorithms',
            'Unsupervised learning techniques',
            'Model evaluation and validation',
            'Feature engineering and selection'
          ],
          videos: [
            {
              title: 'Machine Learning Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg'
            },
            {
              title: 'Machine Learning Explained',
              channel: 'StatQuest',
              url: 'https://www.youtube.com/watch?v=7eh4d6sabA0'
            }
          ],
          detailedContent: {
            overview: 'Machine learning fundamentals provide the foundation for understanding and applying ML algorithms to real-world problems. This module covers supervised and unsupervised learning, model evaluation, feature engineering, and practical implementation. Learn to choose appropriate algorithms, evaluate model performance, and apply ML techniques effectively.',
            prerequisites: ['Python programming', 'Statistics fundamentals', 'Linear algebra basics'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Supervised vs unsupervised learning',
              'Regression algorithms (linear, polynomial, regularized)',
              'Classification algorithms (logistic, decision trees, SVM)',
              'Clustering algorithms (K-means, hierarchical, DBSCAN)',
              'Dimensionality reduction (PCA, t-SNE)',
              'Model evaluation metrics (accuracy, precision, recall, F1)',
              'Cross-validation and hyperparameter tuning',
              'Bias-variance tradeoff',
              'Overfitting and underfitting',
              'Feature engineering and selection'
            ],
            topics: [
              {
                title: 'Supervised Learning',
                description: 'Master algorithms for labeled data prediction.',
                subTopics: [
                  'Linear regression',
                  'Logistic regression',
                  'Decision trees and random forests',
                  'Support vector machines',
                  'K-nearest neighbors'
                ]
              },
              {
                title: 'Unsupervised Learning',
                description: 'Learn algorithms for unlabeled data analysis.',
                subTopics: [
                  'K-means clustering',
                  'Hierarchical clustering',
                  'DBSCAN clustering',
                  'Principal Component Analysis',
                  'Association rules'
                ]
              },
              {
                title: 'Model Evaluation',
                description: 'Evaluate and compare machine learning models.',
                subTopics: [
                  'Train-test split and cross-validation',
                  'Confusion matrices and ROC curves',
                  'Hyperparameter tuning (grid search, random search)',
                  'Model selection strategies',
                  'Performance metrics interpretation'
                ]
              },
              {
                title: 'Feature Engineering',
                description: 'Create and select features for better models.',
                subTopics: [
                  'Feature transformation and scaling',
                  'Polynomial features and interactions',
                  'Feature selection methods',
                  'Handling categorical variables',
                  'Dimensionality reduction'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'House Price Prediction',
                description: 'Build a regression model to predict house prices using real estate data.',
                difficulty: 'Beginner'
              },
              {
                title: 'Customer Segmentation',
                description: 'Implement clustering algorithms to segment customers based on behavior patterns.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Fraud Detection System',
                description: 'Create a classification system to detect fraudulent transactions with balanced accuracy.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Scikit-learn Documentation',
                type: 'documentation',
                url: 'https://scikit-learn.org/stable/documentation.html',
                description: 'Machine learning library documentation'
              },
              {
                title: 'Hands-On Machine Learning',
                type: 'book',
                url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/',
                description: 'Practical ML guide with Scikit-Learn'
              },
              {
                title: 'Kaggle Learn',
                type: 'course',
                url: 'https://www.kaggle.com/learn',
                description: 'Interactive ML tutorials and competitions'
              }
            ]
          }
        },
        {
          id: 'deep-learning',
          title: 'Deep Learning',
          description: 'Build and train neural networks using deep learning frameworks for complex pattern recognition tasks.',
          whatYouWillLearn: [
            'Neural network architectures and training',
            'Convolutional and recurrent networks',
            'Transfer learning and fine-tuning',
            'Deep learning frameworks (TensorFlow, PyTorch)'
          ],
          videos: [
            {
              title: 'Deep Learning for Beginners',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=aircAruvnKk'
            },
            {
              title: 'Neural Networks Visually Explained',
              channel: '3Blue1Brown',
              url: 'https://www.youtube.com/watch?v=aircAruvnKk'
            }
          ],
          detailedContent: {
            overview: 'Deep learning has revolutionized fields like computer vision, natural language processing, and speech recognition. This module covers neural network fundamentals, popular architectures, training techniques, and practical implementation using frameworks like TensorFlow and PyTorch. Learn to build and train deep neural networks for complex tasks.',
            prerequisites: ['Machine learning fundamentals', 'Python programming', 'Calculus and linear algebra'],
            estimatedTime: '10-12 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Neural network architecture (layers, activations)',
              'Backpropagation and gradient descent',
              'Loss functions and optimizers',
              'Regularization techniques (dropout, batch normalization)',
              'Convolutional Neural Networks (CNNs)',
              'Recurrent Neural Networks (RNNs, LSTMs)',
              'Attention mechanisms and transformers',
              'Transfer learning and pre-trained models',
              'Hyperparameter optimization',
              'Model deployment and serving'
            ],
            topics: [
              {
                title: 'Neural Network Fundamentals',
                description: 'Understand the core concepts of neural networks.',
                subTopics: [
                  'Perceptrons and multi-layer networks',
                  'Activation functions',
                  'Forward and backpropagation',
                  'Optimization algorithms',
                  'Loss functions'
                ]
              },
              {
                title: 'Convolutional Networks',
                description: 'Master CNNs for image and spatial data.',
                subTopics: [
                  'Convolutional layers and filters',
                  'Pooling layers',
                  'Popular architectures (VGG, ResNet, EfficientNet)',
                  'Object detection and segmentation',
                  'Image classification and generation'
                ]
              },
              {
                title: 'Sequential Models',
                description: 'Learn models for sequential and time-series data.',
                subTopics: [
                  'RNNs and LSTMs',
                  'Sequence-to-sequence models',
                  'Attention mechanisms',
                  'Transformers and BERT',
                  'Time series forecasting'
                ]
              },
              {
                title: 'Advanced Techniques',
                description: 'Apply advanced deep learning techniques.',
                subTopics: [
                  'Transfer learning',
                  'Fine-tuning pre-trained models',
                  'Data augmentation',
                  'Hyperparameter optimization',
                  'Model compression and optimization'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Image Classification Model',
                description: 'Build and train a CNN for image classification on a custom dataset.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Sentiment Analysis System',
                description: 'Create a sentiment analysis system using transformer models like BERT.',
                difficulty: 'Advanced'
              },
              {
                title: 'Object Detection Application',
                description: 'Develop an object detection system for real-time video processing.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'TensorFlow Documentation',
                type: 'documentation',
                url: 'https://www.tensorflow.org/guide',
                description: 'TensorFlow framework documentation'
              },
              {
                title: 'PyTorch Documentation',
                type: 'documentation',
                url: 'https://pytorch.org/docs/',
                description: 'PyTorch framework documentation'
              },
              {
                title: 'Deep Learning Specialization',
                type: 'course',
                url: 'https://www.deeplearning.ai/',
                description: 'Comprehensive deep learning courses'
              },
              {
                title: 'Papers with Code',
                type: 'tool',
                url: 'https://paperswithcode.com/',
                description: 'ML papers with implementations'
              }
            ]
          }
        },
        {
          id: 'model-deployment',
          title: 'Model Deployment',
          description: 'Deploy and serve machine learning models in production with monitoring and continuous improvement.',
          whatYouWillLearn: [
            'Model serving and API integration',
            'Containerization and orchestration',
            'Monitoring and performance tracking',
            'Model lifecycle management'
          ],
          videos: [
            {
              title: 'Model Deployment Guide',
              channel: 'Google Cloud Tech',
              url: 'https://www.youtube.com/watch?v=06-AZXmwHjo'
            },
            {
              title: 'MLOps Crash Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=9BgIDqAzfuA'
            }
          ],
          detailedContent: {
            overview: 'Model deployment bridges the gap between development and production, ensuring ML models deliver value reliably. This module covers model serving, deployment strategies, monitoring, MLOps practices, and continuous improvement. Learn to deploy models at scale, monitor their performance, and maintain them in production environments.',
            prerequisites: ['Machine learning fundamentals', 'DevOps basics', 'API development'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Model serving strategies (batch, real-time, streaming)',
              'API development for ML models',
              'Containerization with Docker',
              'Orchestration with Kubernetes',
              'Model monitoring and observability',
              'Data drift and concept drift',
              'A/B testing for models',
              'Continuous integration and deployment',
              'Model versioning',
              'Performance optimization'
            ],
            topics: [
              {
                title: 'Model Serving',
                description: 'Serve ML models through APIs and applications.',
                subTopics: [
                  'RESTful API development',
                  'Model serialization formats',
                  'Serving frameworks (Flask, FastAPI, TensorFlow Serving)',
                  'Real-time inference',
                  'Batch processing'
                ]
              },
              {
                title: 'Deployment Strategies',
                description: 'Implement production deployment approaches.',
                subTopics: [
                  'Container-based deployment',
                  'Kubernetes orchestration',
                  'Serverless deployment',
                  'Edge deployment',
                  'Multi-model serving'
                ]
              },
              {
                title: 'Monitoring & Observability',
                description: 'Monitor model performance and behavior.',
                subTopics: [
                  'Model performance metrics',
                  'Data drift detection',
                  'Concept drift monitoring',
                  'Predictive vs actual performance',
                  'Alerting and incident response'
                ]
              },
              {
                title: 'MLOps Practices',
                description: 'Implement ML operations and automation.',
                subTopics: [
                  'Model lifecycle management',
                  'Feature stores',
                  'Continuous training pipelines',
                  'Model governance',
                  'Experiment tracking'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'ML Model API',
                description: 'Build a production-ready API serving a machine learning model with proper error handling and monitoring.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Model Monitoring System',
                description: 'Create a comprehensive monitoring system for tracking model performance and detecting drift.',
                difficulty: 'Advanced'
              },
              {
                title: 'MLOps Pipeline',
                description: 'Develop an end-to-end MLOps pipeline for automated training, deployment, and monitoring.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'MLOps Fundamentals',
                type: 'course',
                url: 'https://www.coursera.org/learn/mlops-fundamentals',
                description: 'MLOps fundamentals course'
              },
              {
                title: 'MLflow Documentation',
                type: 'documentation',
                url: 'https://mlflow.org/docs/latest/index.html',
                description: 'ML lifecycle management platform'
              },
              {
                title: 'Kubeflow Documentation',
                type: 'documentation',
                url: 'https://www.kubeflow.org/docs/',
                description: 'Machine learning toolkit for Kubernetes'
              }
            ]
          }
        },
        {
          id: 'responsible-ai',
          title: 'Responsible AI',
          description: 'Build AI systems that are fair, transparent, accountable, and respectful of user privacy.',
          whatYouWillLearn: [
            'Bias detection and mitigation',
            'Explainability and interpretability',
            'Privacy-preserving techniques',
            'Ethical AI development practices'
          ],
          videos: [
            {
              title: 'Responsible AI Overview',
              channel: 'Google Developers',
              url: 'https://www.youtube.com/watch?v=8Nt6KfRdb8s'
            },
            {
              title: 'Fairness in Machine Learning',
              channel: 'DeepLearningAI',
              url: 'https://www.youtube.com/watch?v=jIXIuYdnyyk'
            }
          ],
          detailedContent: {
            overview: 'Responsible AI ensures that artificial intelligence systems are developed and deployed ethically, with consideration for fairness, transparency, accountability, and privacy. This module covers bias detection and mitigation, explainability techniques, privacy-preserving methods, and ethical development practices. Learn to build AI systems that earn trust and respect human values.',
            prerequisites: ['Machine learning fundamentals', 'Understanding of societal impact', 'Basic ethics knowledge'],
            estimatedTime: '4-6 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Types of bias in AI systems',
              'Fairness metrics and evaluation',
              'Bias detection and mitigation techniques',
              'Model explainability and interpretability',
              'Privacy techniques (differential privacy, federated learning)',
              'Data governance and compliance',
              'Transparency and accountability',
              'Human-in-the-loop systems',
              'Ethical frameworks and guidelines',
              'Impact assessment and auditing'
            ],
            topics: [
              {
                title: 'Fairness & Bias',
                description: 'Identify and mitigate bias in AI systems.',
                subTopics: [
                  'Types of bias (selection, historical, representation)',
                  'Fairness metrics and definitions',
                  'Bias detection techniques',
                  'Data collection and preprocessing for fairness',
                  'Algorithmic bias mitigation'
                ]
              },
              {
                title: 'Explainability',
                description: 'Make AI systems transparent and interpretable.',
                subTopics: [
                  'Interpretability vs explainability',
                  'Local and global explanation methods',
                  'Feature importance techniques',
                  'Model-agnostic explainers (LIME, SHAP)',
                  'Explainable AI (XAI) frameworks'
                ]
              },
              {
                title: 'Privacy & Security',
                description: 'Implement privacy-preserving AI techniques.',
                subTopics: [
                  'Differential privacy',
                  'Federated learning',
                  'Secure multi-party computation',
                  'Data anonymization techniques',
                  'Privacy regulations and compliance'
                ]
              },
              {
                title: 'Ethical AI Practices',
                description: 'Develop and deploy AI systems responsibly.',
                subTopics: [
                  'Ethical frameworks and guidelines',
                  'Impact assessment methodologies',
                  'Stakeholder engagement',
                  'Governance and oversight',
                  'Responsible AI in organizations'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Bias Detection Tool',
                description: 'Create a tool to detect and analyze bias in machine learning models.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Explainability Dashboard',
                description: 'Build a dashboard that provides model explanations and feature importance analysis.',
                difficulty: 'Advanced'
              },
              {
                title: 'Privacy-Preserving ML System',
                description: 'Develop a machine learning system that uses federated learning or differential privacy.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Google AI Principles',
                type: 'documentation',
                url: 'https://ai.google/principles/',
                description: 'Google\'s AI principles and practices'
              },
              {
                title: 'Microsoft Responsible AI',
                type: 'documentation',
                url: 'https://www.microsoft.com/ai/responsible-ai',
                description: 'Microsoft\'s responsible AI resources'
              },
              {
                title: 'Fairlearn Documentation',
                type: 'documentation',
                url: 'https://fairlearn.org/',
                description: 'Fairness evaluation and mitigation library'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'cybersecurity',
      technology: 'Cybersecurity',
      category: 'Security',
      levels: ['Fresher', 'Experienced'],
      overview: 'Protect systems by understanding threats, hardening defenses, and responding quickly.',
      subTechnologies: [
        {
          id: 'security-basics',
          title: 'Security Foundations',
          description: 'Build a strong foundation in cybersecurity principles, threats, and defense mechanisms.',
          whatYouWillLearn: [
            'Cybersecurity fundamentals and concepts',
            'Threat landscape and attack vectors',
            'Network and system security',
            'Security policies and compliance'
          ],
          videos: [
            {
              title: 'Cyber Security Full Course',
              channel: 'Simplilearn',
              url: 'https://www.youtube.com/watch?v=inWWhr5tnEA'
            },
            {
              title: 'Cybersecurity for Beginners',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=U_P23SqJaDc'
            }
          ],
          detailedContent: {
            overview: 'Security foundations provide the essential knowledge needed to understand cybersecurity threats and implement effective defense mechanisms. This module covers core security concepts, threat landscape, network security, system hardening, and security policies. Learn to think like a security professional and build secure systems from the ground up.',
            prerequisites: ['Basic networking knowledge', 'Understanding of operating systems', 'Fundamental IT concepts'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Beginner',
            keyConcepts: [
              'CIA triad (Confidentiality, Integrity, Availability)',
              'Threat actors and motivations',
              'Attack vectors and methodologies',
              'Network security principles',
              'System hardening techniques',
              'Identity and access management',
              'Security policies and procedures',
              'Compliance and regulatory requirements',
              'Risk management frameworks',
              'Security architecture principles'
            ],
            topics: [
              {
                title: 'Security Fundamentals',
                description: 'Master core cybersecurity concepts and principles.',
                subTopics: [
                  'CIA triad and security principles',
                  'Threat landscape overview',
                  'Attack types and methodologies',
                  'Security assessment approaches',
                  'Security mindset and thinking'
                ]
              },
              {
                title: 'Network Security',
                description: 'Implement network security measures and controls.',
                subTopics: [
                  'Network segmentation and isolation',
                  'Firewalls and intrusion detection',
                  'Secure protocols (TLS, SSH, VPN)',
                  'Network monitoring and analysis',
                  'Wireless security'
                ]
              },
              {
                title: 'System Security',
                description: 'Secure operating systems and applications.',
                subTopics: [
                  'Operating system hardening',
                  'Access control mechanisms',
                  'Patch management',
                  'Secure configuration',
                  'Application security basics'
                ]
              },
              {
                title: 'Security Governance',
                description: 'Understand security policies and compliance.',
                subTopics: [
                  'Security policies and procedures',
                  'Risk assessment methodologies',
                  'Compliance frameworks (GDPR, HIPAA, PCI-DSS)',
                  'Security awareness training',
                  'Incident response procedures'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Security Assessment',
                description: 'Conduct a basic security assessment of a small network or system.',
                difficulty: 'Beginner'
              },
              {
                title: 'Secure Network Design',
                description: 'Design a secure network architecture with proper segmentation and security controls.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Security Policy Development',
                description: 'Create comprehensive security policies for an organization.',
                difficulty: 'Intermediate'
              }
            ],
            resources: [
              {
                title: 'NIST Cybersecurity Framework',
                type: 'documentation',
                url: 'https://www.nist.gov/cyberframework',
                description: 'Official cybersecurity framework'
              },
              {
                title: 'CompTIA Security+',
                type: 'course',
                url: 'https://www.comptia.org/certifications/security',
                description: 'Security certification study materials'
              },
              {
                title: 'OWASP Security Knowledge Framework',
                type: 'tool',
                url: 'https://owasp.org/www-project-security-knowledge-framework/',
                description: 'Comprehensive security knowledge base'
              }
            ]
          }
        },
        {
          id: 'web-security',
          title: 'Web Security',
          description: 'Secure web applications against common vulnerabilities and attacks using OWASP best practices.',
          whatYouWillLearn: [
            'OWASP Top 10 vulnerabilities',
            'Web application security testing',
            'Secure coding practices',
            'Attack detection and prevention'
          ],
          videos: [
            {
              title: 'OWASP Top 10 Explained',
              channel: 'Hussein Nasser',
              url: 'https://www.youtube.com/watch?v=pM8wK6wYk7w'
            },
            {
              title: 'Web App Security Basics',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs'
            }
          ],
          detailedContent: {
            overview: 'Web security focuses on protecting web applications from common vulnerabilities and attacks that can lead to data breaches, service disruption, and other security incidents. This module covers OWASP Top 10 vulnerabilities, security testing, secure development practices, and defense mechanisms. Learn to build and maintain secure web applications.',
            prerequisites: ['Web development basics', 'Understanding of HTTP protocol', 'Basic programming knowledge'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'OWASP Top 10 vulnerabilities',
              'Injection attacks (SQL, NoSQL, OS command)',
              'Cross-site scripting (XSS) prevention',
              'Cross-site request forgery (CSRF) protection',
              'Security misconfigurations',
              'Broken access control',
              'Security testing methodologies',
              'Secure authentication and authorization',
              'Input validation and output encoding',
              'HTTPS and TLS configuration'
            ],
            topics: [
              {
                title: 'OWASP Top 10',
                description: 'Master the most critical web application security risks.',
                subTopics: [
                  'Injection vulnerabilities',
                  'Broken authentication',
                  'Sensitive data exposure',
                  'XML external entities (XXE)',
                  'Broken access control'
                ]
              },
              {
                title: 'Vulnerability Assessment',
                description: 'Identify and test for web application vulnerabilities.',
                subTopics: [
                  'Manual security testing',
                  'Automated scanning tools',
                  'Vulnerability assessment methodologies',
                  'Penetration testing basics',
                  'Security code review'
                ]
              },
              {
                title: 'Secure Development',
                description: 'Implement secure coding practices.',
                subTopics: [
                  'Input validation and sanitization',
                  'Output encoding and escaping',
                  'Secure authentication mechanisms',
                  'Authorization and access control',
                  'Secure session management'
                ]
              },
              {
                title: 'Defense Mechanisms',
                description: 'Implement security controls and protections.',
                subTopics: [
                  'Web Application Firewalls (WAF)',
                  'Content Security Policy (CSP)',
                  'HTTP security headers',
                  'Secure cookie configuration',
                  'Rate limiting and throttling'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Vulnerable App Analysis',
                description: 'Analyze a deliberately vulnerable web application and identify security flaws.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Security Scanner Development',
                description: 'Build a basic web application security scanner for common vulnerabilities.',
                difficulty: 'Advanced'
              },
              {
                title: 'Secure Application Development',
                description: 'Develop a web application following secure coding practices and implement comprehensive security measures.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'OWASP Top 10',
                type: 'documentation',
                url: 'https://owasp.org/www-project-top-ten/',
                description: 'Critical web application security risks'
              },
              {
                title: 'OWASP Testing Guide',
                type: 'documentation',
                url: 'https://owasp.org/www-project-web-security-testing-guide/',
                description: 'Web application security testing guide'
              },
              {
                title: 'Burp Suite Documentation',
                type: 'tool',
                url: 'https://portswigger.net/burp/documentation',
                description: 'Web security testing tool documentation'
              }
            ]
          }
        },
        {
          id: 'ethical-hacking',
          title: 'Ethical Hacking',
          description: 'Conduct authorized penetration testing and vulnerability assessments to improve security posture.',
          whatYouWillLearn: [
            'Penetration testing methodologies',
            'Vulnerability assessment techniques',
            'Exploitation and privilege escalation',
            'Responsible disclosure and reporting'
          ],
          videos: [
            {
              title: 'Ethical Hacking Course',
              channel: 'freeCodeCamp.org',
              url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE'
            },
            {
              title: 'Penetration Testing Basics',
              channel: 'NetworkChuck',
              url: 'https://www.youtube.com/watch?v=0uvWRwJ6xqo'
            }
          ],
          detailedContent: {
            overview: 'Ethical hacking involves legally breaking into systems and applications to discover vulnerabilities that malicious hackers could exploit. This module covers penetration testing methodologies, reconnaissance techniques, vulnerability assessment, exploitation methods, and responsible reporting. Learn to think like an attacker while maintaining ethical standards and legal compliance.',
            prerequisites: ['Networking fundamentals', 'System administration basics', 'Programming knowledge'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'Penetration testing methodologies (PTES, OSSTMM)',
              'Reconnaissance and information gathering',
              'Vulnerability scanning and assessment',
              'Exploitation techniques and privilege escalation',
              'Post-exploitation activities',
              'Social engineering fundamentals',
              'Network security testing',
              'Web application penetration testing',
              'Report writing and responsible disclosure',
              'Legal and ethical considerations'
            ],
            topics: [
              {
                title: 'Penetration Testing Methodology',
                description: 'Follow structured penetration testing approaches.',
                subTopics: [
                  'Planning and scoping',
                  'Reconnaissance and information gathering',
                  'Vulnerability assessment',
                  'Exploitation',
                  'Post-exploitation and reporting'
                ]
              },
              {
                title: 'Vulnerability Assessment',
                description: 'Identify and evaluate security vulnerabilities.',
                subTopics: [
                  'Vulnerability scanning tools',
                  'Manual vulnerability discovery',
                  'CVE analysis and prioritization',
                  'Risk assessment methodologies',
                  'Vulnerability validation'
                ]
              },
              {
                title: 'Exploitation Techniques',
                description: 'Understand and perform controlled exploitation.',
                subTopics: [
                  'Network-based exploitation',
                  'Web application attacks',
                  'Privilege escalation techniques',
                  'Password cracking and credential attacks',
                  'Social engineering attacks'
                ]
              },
              {
                title: 'Ethical & Legal Aspects',
                description: 'Understand legal requirements and ethical practices.',
                subTopics: [
                  'Legal frameworks and authorization',
                  'Responsible disclosure procedures',
                  'Professional ethics and standards',
                  'Reporting and documentation',
                  'Client communication'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Vulnerability Assessment',
                description: 'Perform a comprehensive vulnerability assessment on a test system.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Penetration Testing Lab',
                description: 'Set up and conduct penetration testing on a controlled lab environment.',
                difficulty: 'Advanced'
              },
              {
                title: 'Security Assessment Report',
                description: 'Complete a full security assessment with detailed findings and remediation recommendations.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'Kali Linux Tools',
                type: 'tool',
                url: 'https://www.kali.org/tools/',
                description: 'Penetration testing tools documentation'
              },
              {
                title: 'Metasploit Documentation',
                type: 'documentation',
                url: 'https://docs.metasploit.com/',
                description: 'Exploitation framework documentation'
              },
              {
                title: 'CEH Certification',
                type: 'course',
                url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/',
                description: 'Certified Ethical Hacker certification'
              }
            ]
          }
        },
        {
          id: 'soc-incident-response',
          title: 'SOC & Incident Response',
          description: 'Monitor, detect, and respond to security incidents using Security Operations Center best practices.',
          whatYouWillLearn: [
            'SOC operations and monitoring',
            'Incident response methodologies',
            'Security information and event management',
            'Threat hunting and analysis'
          ],
          videos: [
            {
              title: 'SOC Analyst Roadmap',
              channel: 'David Bombal',
              url: 'https://www.youtube.com/watch?v=P4RzE3Pib0g'
            },
            {
              title: 'Incident Response Process',
              channel: 'SANS Institute',
              url: 'https://www.youtube.com/watch?v=6M51jR2jLS4'
            }
          ],
          detailedContent: {
            overview: 'Security Operations Centers (SOCs) are centralized units that monitor, detect, analyze, and respond to security incidents. This module covers SOC operations, incident response methodologies, SIEM platforms, threat intelligence, and continuous monitoring. Learn to operate effectively in a SOC environment and respond efficiently to security incidents.',
            prerequisites: ['Network security fundamentals', 'System administration', 'Basic security knowledge'],
            estimatedTime: '8-10 weeks',
            difficulty: 'Advanced',
            keyConcepts: [
              'SOC operations and workflows',
              'Incident response lifecycle (NIST framework)',
              'SIEM platforms and correlation',
              'Log management and analysis',
              'Threat detection and alerting',
              'Security monitoring and analysis',
              'Threat hunting techniques',
              'Incident classification and prioritization',
              'Forensics and evidence collection',
              'Communication and coordination'
            ],
            topics: [
              {
                title: 'SOC Operations',
                description: 'Understand Security Operations Center functions.',
                subTopics: [
                  'SOC organizational structure',
                  'Monitoring and detection processes',
                  'Alert triage and analysis',
                  'Security ticket management',
                  'Shift handoffs and documentation'
                ]
              },
              {
                title: 'Incident Response',
                description: 'Implement effective incident response procedures.',
                subTopics: [
                  'Incident response frameworks',
                  'Preparation and prevention',
                  'Detection and analysis',
                  'Containment and eradication',
                  'Recovery and lessons learned'
                ]
              },
              {
                title: 'SIEM and Analytics',
                description: 'Utilize SIEM platforms for security monitoring.',
                subTopics: [
                  'SIEM architecture and components',
                  'Log collection and normalization',
                  'Rule creation and correlation',
                  'Dashboard development',
                  'Threat intelligence integration'
                ]
              },
              {
                title: 'Threat Hunting',
                description: 'Proactively search for hidden threats.',
                subTopics: [
                  'Threat hunting methodologies',
                  'Hypothesis development',
                  'Data analysis techniques',
                  'Threat intelligence utilization',
                  'Automation and tooling'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'SIEM Implementation',
                description: 'Set up and configure a SIEM solution for log collection and alerting.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Incident Response Playbook',
                description: 'Develop incident response playbooks for common security incidents.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Threat Hunting Exercise',
                description: 'Conduct a threat hunting exercise on a simulated environment to detect hidden threats.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'NIST Incident Response Framework',
                type: 'documentation',
                url: 'https://www.nist.gov/publications/computer-security-publications/guidelines-incident-response',
                description: 'Official incident response guidelines'
              },
              {
                title: 'Splunk Documentation',
                type: 'documentation',
                url: 'https://docs.splunk.com/Documentation',
                description: 'SIEM platform documentation'
              },
              {
                title: 'SANS Incident Response',
                type: 'course',
                url: 'https://www.sans.org/course/incident-response-handling-advanced/',
                description: 'Advanced incident response training'
              }
            ]
          }
        },
        {
          id: 'cloud-security',
          title: 'Cloud Security',
          description: 'Secure cloud infrastructure and applications using cloud-native security controls and best practices.',
          whatYouWillLearn: [
            'Cloud security fundamentals and shared responsibility',
            'Identity and access management',
            'Cloud network security',
            'Compliance and governance'
          ],
          videos: [
            {
              title: 'Cloud Security Fundamentals',
              channel: 'Google Cloud Tech',
              url: 'https://www.youtube.com/watch?v=2LaAJq1lB1Q'
            },
            {
              title: 'AWS Security Essentials',
              channel: 'AWS Events',
              url: 'https://www.youtube.com/watch?v=6N7f3xV6Y2Y'
            }
          ],
          detailedContent: {
            overview: 'Cloud security requires understanding the shared responsibility model and implementing appropriate controls across infrastructure, platforms, and applications. This module covers cloud security fundamentals, identity management, network security, data protection, and compliance. Learn to secure cloud environments across major providers like AWS, Azure, and Google Cloud.',
            prerequisites: ['Cloud computing fundamentals', 'Network security basics', 'Understanding of IAM concepts'],
            estimatedTime: '6-8 weeks',
            difficulty: 'Intermediate',
            keyConcepts: [
              'Shared responsibility model',
              'Cloud IAM and identity management',
              'Cloud network security (VPC, security groups)',
              'Data encryption and protection',
              'Cloud security monitoring',
              'Compliance and governance frameworks',
              'Container security',
              'Serverless security',
              'Cloud-native security tools',
              'Cloud incident response'
            ],
            topics: [
              {
                title: 'Cloud Security Fundamentals',
                description: 'Understand cloud security principles and models.',
                subTopics: [
                  'Shared responsibility model',
                  'Cloud service models security',
                  'Cloud provider security offerings',
                  'Cloud security architecture',
                  'Threat landscape and challenges'
                ]
              },
              {
                title: 'Identity & Access Management',
                description: 'Manage identities and access in cloud environments.',
                subTopics: [
                  'IAM concepts and policies',
                  'Multi-factor authentication',
                  'Identity federation (SSO, OAuth, SAML)',
                  'Least privilege principles',
                  'Privileged access management'
                ]
              },
              {
                title: 'Network & Infrastructure Security',
                description: 'Secure cloud networks and infrastructure.',
                subTopics: [
                  'VPC and subnet design',
                  'Security groups and NACLs',
                  'Cloud firewalls and WAF',
                  'Load balancer security',
                  'Cloud-native security services'
                ]
              },
              {
                title: 'Data Protection & Compliance',
                description: 'Protect data and ensure regulatory compliance.',
                subTopics: [
                  'Encryption at rest and in transit',
                  'Key management services',
                  'Data loss prevention (DLP)',
                  'Compliance frameworks (SOC 2, HIPAA, GDPR)',
                  'Security governance and audit'
                ]
              }
            ],
            practicalProjects: [
              {
                title: 'Cloud Security Assessment',
                description: 'Conduct a security assessment of a cloud environment and identify vulnerabilities.',
                difficulty: 'Intermediate'
              },
              {
                title: 'Secure Cloud Architecture',
                description: 'Design a secure cloud architecture with proper segmentation, IAM, and monitoring.',
                difficulty: 'Advanced'
              },
              {
                title: 'Cloud Compliance Framework',
                description: 'Implement a compliance framework for a cloud environment meeting regulatory requirements.',
                difficulty: 'Advanced'
              }
            ],
            resources: [
              {
                title: 'CSA Cloud Controls Matrix',
                type: 'documentation',
                url: 'https://cloudsecurityalliance.org/research/cloud-controls-matrix/',
                description: 'Cloud security controls framework'
              },
              {
                title: 'AWS Security Best Practices',
                type: 'documentation',
                url: 'https://docs.aws.amazon.com/whitepapers/latest/security-overview/',
                description: 'AWS security guidelines'
              },
              {
                title: 'Cloud Security Alliance',
                type: 'course',
                url: 'https://cloudsecurityalliance.org/education/',
                description: 'Cloud security training and certification'
              }
            ]
          }
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getTechnologyCatalog(): Observable<TechnologyRoadmap[]> {
    return of(this.technologyCatalog);
  }

  getAllRoadmaps() {
    return this.http.get(`${this.baseUrl}/roadmaps`);
  }

  getUserRoadmaps() {
    return this.http.get(`${this.baseUrl}/user-roadmaps`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserStatistics() {
    return this.http.get(`${this.baseUrl}/user-roadmaps/statistics`, {
      headers: this.getAuthHeaders()
    });
  }

  addUserRoadmap(data: any) {
    return this.http.post(`${this.baseUrl}/user-roadmaps`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getUserBadges() {
    return this.http.get(`${this.baseUrl}/badges/user`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserRoadmap(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/user-roadmaps/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUserRoadmap(id: string) {
    return this.http.delete(`${this.baseUrl}/user-roadmaps/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Notes API methods
  getUserNotes(params: any = {}) {
    return this.http.get(`${this.baseUrl}/notes`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  createNote(data: any) {
    return this.http.post(`${this.baseUrl}/notes`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateNote(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/notes/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteNote(id: string) {
    return this.http.delete(`${this.baseUrl}/notes/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Quiz API methods
  getQuiz(subTechnologyId: string) {
    return this.http.get(`${this.baseUrl}/quizzes/${subTechnologyId}`, {
      headers: this.getAuthHeaders()
    });
  }

  submitQuiz(quizId: string, answers: any, timeSpent: number) {
    return this.http.post(`${this.baseUrl}/quizzes/${quizId}/submit`, {
      answers,
      timeSpent
    }, {
      headers: this.getAuthHeaders()
    });
  }

  getQuizResults(params: any = {}) {
    return this.http.get(`${this.baseUrl}/quizzes`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getQuizStatistics() {
    return this.http.get(`${this.baseUrl}/quizzes/statistics`, {
      headers: this.getAuthHeaders()
    });
  }

  // Time Tracking API methods
  startLearningSession(roadmapId: string) {
    return this.http.post(`${this.baseUrl}/time-tracking/session/start`, {
      roadmapId
    }, {
      headers: this.getAuthHeaders()
    });
  }

  endLearningSession(roadmapId: string, sessionId: string, timeSpent: number) {
    return this.http.post(`${this.baseUrl}/time-tracking/session/end`, {
      roadmapId,
      sessionId,
      timeSpent
    }, {
      headers: this.getAuthHeaders()
    });
  }

  getTimeAnalytics(params: any = {}) {
    return this.http.get(`${this.baseUrl}/time-tracking/analytics`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getTimeStreaks() {
    return this.http.get(`${this.baseUrl}/time-tracking/streaks`, {
      headers: this.getAuthHeaders()
    });
  }

  // Forum API methods
  createForum(data: any) {
    return this.http.post(`${this.baseUrl}/forums`, data, {
      headers: this.getAuthHeaders()
    });
  }

  searchForums(query: string) {
    return this.http.get(`${this.baseUrl}/forums/search`, {
      headers: this.getAuthHeaders(),
      params: { q: query }
    });
  }

  getTechnologyForums(technologyId: string) {
    return this.http.get(`${this.baseUrl}/forums/technology/${technologyId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getForumWithReplies(forumId: string) {
    return this.http.get(`${this.baseUrl}/forums/${forumId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addReply(forumId: string, data: any) {
    return this.http.post(`${this.baseUrl}/forums/${forumId}/replies`, data, {
      headers: this.getAuthHeaders()
    });
  }

  likeReply(replyId: string) {
    return this.http.post(`${this.baseUrl}/forums/replies/${replyId}/like`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  acceptAnswer(replyId: string) {
    return this.http.put(`${this.baseUrl}/forums/replies/${replyId}/accept`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  togglePinForum(forumId: string) {
    return this.http.put(`${this.baseUrl}/forums/${forumId}/pin`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  toggleLockForum(forumId: string) {
    return this.http.put(`${this.baseUrl}/forums/${forumId}/lock`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // User follow methods
  followUser(targetUserId: string) {
    return this.http.post(`${this.baseUrl}/social/follow/${targetUserId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  unfollowUser(targetUserId: string) {
    return this.http.post(`${this.baseUrl}/social/unfollow/${targetUserId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // User connections
  getUserConnections() {
    return this.http.get(`${this.baseUrl}/social/connections`, {
      headers: this.getAuthHeaders()
    });
  }

  acceptFollowRequest(connectionId: string) {
    return this.http.post(`${this.baseUrl}/social/accept/${connectionId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // User search
  searchUsers(query: string) {
    return this.http.get(`${this.baseUrl}/social/search`, {
      headers: this.getAuthHeaders(),
      params: { q: query }
    });
  }

  // Social statistics
  getSocialStatistics() {
    return this.http.get(`${this.baseUrl}/social/statistics`, {
      headers: this.getAuthHeaders()
    });
  }

  // Post comments
  addComment(postId: string, data: any) {
    return this.http.post(`${this.baseUrl}/social/posts/${postId}/comments`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getPostComments(postId: string) {
    return this.http.get(`${this.baseUrl}/social/posts/${postId}/comments`, {
      headers: this.getAuthHeaders()
    });
  }

  // Leaderboard methods
  getLeaderboard(type: string = 'points', limit: number = 50) {
    return this.http.get(`${this.baseUrl}/analytics/leaderboard`, {
      headers: this.getAuthHeaders(),
      params: { type, limit }
    });
  }

  // Analytics methods
  getLearningPatterns(period: string = '30d') {
    return this.http.get(`${this.baseUrl}/analytics/learning-patterns`, {
      headers: this.getAuthHeaders(),
      params: { period }
    });
  }

  getProgressTimeline() {
    return this.http.get(`${this.baseUrl}/analytics/progress-timeline`, {
      headers: this.getAuthHeaders()
    });
  }

  getDetailedStatistics() {
    return this.http.get(`${this.baseUrl}/analytics/detailed-statistics`, {
      headers: this.getAuthHeaders()
    });
  }

  trackLearningSession(data: any) {
    return this.http.post(`${this.baseUrl}/analytics/session`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Social feed methods
  getSocialFeed(params: any = {}) {
    return this.http.get(`${this.baseUrl}/social/feed`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getFollowingFeed(params: any = {}) {
    return this.http.get(`${this.baseUrl}/social/feed`, {
      headers: this.getAuthHeaders(),
      params: { ...params, following: true }
    });
  }

  getUserFeed(params: any = {}) {
    return this.http.get(`${this.baseUrl}/social/feed`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  createPost(data: any) {
    return this.http.post(`${this.baseUrl}/social/posts`, data, {
      headers: this.getAuthHeaders()
    });
  }

  likePost(postId: string) {
    return this.http.post(`${this.baseUrl}/social/posts/${postId}/like`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin API methods
  getAdminStats() {
    return this.http.get(`${this.baseUrl}/admin/dashboard/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminUsers(params: any = {}) {
    return this.http.get(`${this.baseUrl}/admin/users`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  updateUserRole(userId: string, isAdmin: boolean) {
    return this.http.patch(`${this.baseUrl}/admin/users/${userId}/role`, { isAdmin }, {
      headers: this.getAuthHeaders()
    });
  }

  toggleUserBan(userId: string, action: string, reason?: string) {
    return this.http.post(`${this.baseUrl}/admin/users/${userId}/ban`, { action, reason }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminLogs(params: any = {}) {
    return this.http.get(`${this.baseUrl}/admin/logs`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getFlaggedContent(type: string = 'all') {
    return this.http.get(`${this.baseUrl}/admin/moderation/flagged`, {
      headers: this.getAuthHeaders(),
      params: { type }
    });
  }

  moderateContent(data: any) {
    return this.http.post(`${this.baseUrl}/admin/moderate`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getSystemAnalytics(period: string = '30d') {
    return this.http.get(`${this.baseUrl}/admin/analytics`, {
      headers: this.getAuthHeaders(),
      params: { period }
    });
  }

  // Get current user profile
  getUserProfile() {
    return this.http.get(`${this.baseUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
