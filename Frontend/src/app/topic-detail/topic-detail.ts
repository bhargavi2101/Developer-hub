import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface TopicDetailData {
  title: string;
  description: string;
  subTopics: string[];
  estimatedTime: string;
  keyConcepts: string[];
  learningOutcome1: string;
  learningOutcome2: string;
  learningOutcome3: string;
  practicalProject: string;
  relatedTopics: string[];
}

@Component({
  selector: 'app-topic-detail',
  standalone: false,
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css'
})
export class TopicDetail implements OnInit {
  topic: TopicDetailData | null = null;
  technologyId: string = '';
  subTechnologyId: string = '';
  topicIndex: number = 0;
  isLoading: boolean = true;
  selectedSubTopic: string | null = null;
  subTopicDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.technologyId = params['technologyId'];
      this.subTechnologyId = params['subTechnologyId'];
      this.topicIndex = params['topicIndex'] ? parseInt(params['topicIndex']) : 0;
      this.loadTopicDetail();
    });
  }

  loadTopicDetail(): void {
    const topicDatabase: any = {
      'html-css': [
        {
          title: 'HTML Structure & Semantics',
          description: 'Learn how to create well-structured, accessible HTML documents using semantic elements.',
          subTopics: ['Document Structure', 'Semantic Elements', 'Forms and Validation', 'Tables', 'SEO Metadata'],
          estimatedTime: '6-8 hours',
          keyConcepts: ['HTML5 structure', 'Semantic elements', 'Accessibility', 'SEO optimization'],
          learningOutcome1: 'Create properly structured HTML5 documents',
          learningOutcome2: 'Use semantic elements for better accessibility',
          learningOutcome3: 'Optimize pages for search engines',
          practicalProject: 'Build a semantic webpage with forms and tables',
          relatedTopics: ['CSS Fundamentals', 'Web Accessibility']
        },
        {
          title: 'CSS Fundamentals',
          description: 'Master CSS syntax, selectors, and core styling concepts.',
          subTopics: ['CSS Syntax', 'Selectors', 'Colors & Units', 'Typography', 'Box Model'],
          estimatedTime: '8-10 hours',
          keyConcepts: ['CSS syntax', 'Selectors', 'Colors', 'Typography', 'Box model'],
          learningOutcome1: 'Write clean CSS code',
          learningOutcome2: 'Use advanced selectors effectively',
          learningOutcome3: 'Master typography and spacing',
          practicalProject: 'Style a complete webpage',
          relatedTopics: ['Layout Systems', 'Responsive Design']
        },
        {
          title: 'Layout Systems',
          description: 'Learn Flexbox and CSS Grid for complex layouts.',
          subTopics: ['Flexbox', 'CSS Grid', 'Positioning', 'Float', 'Responsive Layouts'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['Flexbox', 'CSS Grid', 'Positioning', 'Responsive design'],
          learningOutcome1: 'Create layouts with Flexbox and Grid',
          learningOutcome2: 'Position elements precisely',
          learningOutcome3: 'Build responsive layouts',
          practicalProject: 'Create a dashboard layout',
          relatedTopics: ['Responsive Design', 'UI/UX Design']
        },
        {
          title: 'Responsive Design',
          description: 'Create designs that work seamlessly across all devices.',
          subTopics: ['Mobile-first', 'Media Queries', 'Fluid Design', 'Responsive Images', 'Touch UI'],
          estimatedTime: '8-10 hours',
          keyConcepts: ['Mobile-first', 'Media queries', 'Responsive images', 'Touch design'],
          learningOutcome1: 'Implement mobile-first responsive designs',
          learningOutcome2: 'Create fluid layouts and typography',
          learningOutcome3: 'Optimize for touch interactions',
          practicalProject: 'Build a responsive e-commerce site',
          relatedTopics: ['Layout Systems', 'Performance']
        }
      ],
      'javascript-typescript': [
        {
          title: 'JavaScript Fundamentals',
          description: 'Master core JavaScript concepts and modern syntax.',
          subTopics: ['Variables & Types', 'Operators', 'Control Flow', 'Functions', 'Arrays', 'Objects'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Variables', 'Data types', 'Functions', 'Arrays', 'Objects', 'Scope'],
          learningOutcome1: 'Write clean JavaScript code',
          learningOutcome2: 'Understand data types and operators',
          learningOutcome3: 'Create reusable functions',
          practicalProject: 'Build a CRUD application',
          relatedTopics: ['Modern JavaScript', 'DOM Manipulation']
        },
        {
          title: 'Modern JavaScript (ES6+)',
          description: 'Learn latest JavaScript features and syntax.',
          subTopics: ['Arrow Functions', 'Template Literals', 'Destructuring', 'Spread/Rest', 'Modules', 'Optional Chaining'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['ES6 features', 'Arrow functions', 'Destructuring', 'Modules'],
          learningOutcome1: 'Use modern ES6+ features',
          learningOutcome2: 'Apply advanced JavaScript concepts',
          learningOutcome3: 'Implement modern patterns',
          practicalProject: 'Refactor legacy JavaScript',
          relatedTopics: ['Async Programming', 'TypeScript']
        },
        {
          title: 'Asynchronous Programming',
          description: 'Handle async operations with promises and async/await.',
          subTopics: ['Event Loop', 'Promises', 'Async/Await', 'Error Handling', 'Parallel vs Sequential'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Event loop', 'Promises', 'Async/await', 'Error handling'],
          learningOutcome1: 'Understand JavaScript event loop',
          learningOutcome2: 'Write clean async code',
          learningOutcome3: 'Handle errors properly',
          practicalProject: 'Build a data dashboard',
          relatedTopics: ['API Integration', 'Real-time Updates']
        },
        {
          title: 'TypeScript Fundamentals',
          description: 'Add type safety to JavaScript with TypeScript.',
          subTopics: ['Types', 'Interfaces', 'Classes', 'Generics', 'Type Guards', 'Configuration'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['Type system', 'Interfaces', 'Classes', 'Generics'],
          learningOutcome1: 'Add type safety to JavaScript',
          learningOutcome2: 'Create reusable components',
          learningOutcome3: 'Configure TypeScript projects',
          practicalProject: 'Build a typed REST client',
          relatedTopics: ['Modern JavaScript', 'Angular Core']
        }
      ],
      'angular-core': [
        {
          title: 'Components and Templates',
          description: 'Master Angular component-based architecture.',
          subTopics: ['Lifecycle Hooks', 'Data Binding', 'Component Communication', 'Styling', 'Best Practices'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Components', 'Lifecycle', 'Data binding', 'Communication'],
          learningOutcome1: 'Create well-structured Angular components',
          learningOutcome2: 'Implement proper communication',
          learningOutcome3: 'Optimize component performance',
          practicalProject: 'Build a component library',
          relatedTopics: ['Directives', 'Services', 'Architecture']
        },
        {
          title: 'Directives and Pipes',
          description: 'Extend HTML with custom directives and transform data with pipes.',
          subTopics: ['Built-in Directives', 'Custom Directives', 'Built-in Pipes', 'Custom Pipes', 'Pipes Chaining'],
          estimatedTime: '8-10 hours',
          keyConcepts: ['Directives', 'Pipes', 'Custom functionality', 'Data transformation'],
          learningOutcome1: 'Use built-in directives effectively',
          learningOutcome2: 'Create custom directives',
          learningOutcome3: 'Build custom pipes',
          practicalProject: 'Create directive and pipe libraries',
          relatedTopics: ['Components', 'Templates', 'Data Transformation']
        },
        {
          title: 'Services and Dependency Injection',
          description: 'Implement services for business logic and master DI.',
          subTopics: ['Service Creation', 'DI Fundamentals', 'Providers', 'Service Scope', 'HTTP Client'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['Services', 'Dependency injection', 'HTTP', 'Observables'],
          learningOutcome1: 'Create and register services',
          learningOutcome2: 'Use dependency injection effectively',
          learningOutcome3: 'Integrate with REST APIs',
          practicalProject: 'Build a data service layer',
          relatedTopics: ['RxJS', 'State Management', 'API Integration']
        },
        {
          title: 'Routing and Navigation',
          description: 'Implement client-side routing and navigation guards.',
          subTopics: ['Route Configuration', 'Navigation', 'Route Parameters', 'Route Guards', 'Lazy Loading'],
          estimatedTime: '8-10 hours',
          keyConcepts: ['Routing', 'Navigation', 'Guards', 'Lazy loading', 'Performance'],
          learningOutcome1: 'Configure routing in Angular applications',
          learningOutcome2: 'Implement route guards',
          learningOutcome3: 'Optimize with lazy loading',
          practicalProject: 'Build a multi-page application',
          relatedTopics: ['Architecture', 'Authentication', 'Performance']
        }
      ],
      'react-core': [
        {
          title: 'React Fundamentals',
          description: 'Learn core React concepts including components, JSX, and state.',
          subTopics: ['Components', 'JSX', 'State', 'Events', 'Conditional Rendering', 'Lists'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Components', 'JSX', 'State', 'Hooks', 'Lifecycle'],
          learningOutcome1: 'Build functional React components',
          learningOutcome2: 'Handle events and conditional rendering',
          learningOutcome3: 'Use React hooks effectively',
          practicalProject: 'Build a React application',
          relatedTopics: ['React Hooks', 'State Management', 'Patterns']
        },
        {
          title: 'React Hooks',
          description: 'Master React hooks for state and side effects.',
          subTopics: ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'Custom Hooks'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['Hooks', 'State management', 'Performance', 'Custom hooks'],
          learningOutcome1: 'Use built-in React hooks',
          learningOutcome2: 'Create custom hooks',
          learningOutcome3: 'Optimize performance',
          practicalProject: 'Build custom hook library',
          relatedTopics: ['React Fundamentals', 'State Management', 'Performance']
        },
        {
          title: 'State Management',
          description: 'Implement advanced state management solutions.',
          subTopics: ['Context API', 'Redux', 'Redux Toolkit', 'Zustand', 'State Patterns'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Context', 'Redux', 'State management', 'Performance'],
          learningOutcome1: 'Choose state management solutions',
          learningOutcome2: 'Implement Redux Toolkit',
          learningOutcome3: 'Optimize state performance',
          practicalProject: 'Build comprehensive application',
          relatedTopics: ['React Hooks', 'API Integration', 'Architecture']
        }
      ],
      'node-backend': [
        {
          title: 'Node.js Fundamentals',
          description: 'Master server-side JavaScript with Node.js.',
          subTopics: ['Architecture', 'Event Loop', 'Modules', 'File System', 'Streams', 'Error Handling'],
          estimatedTime: '12-15 hours',
          keyConcepts: ['Node runtime', 'Event loop', 'File system', 'Streams', 'Modules'],
          learningOutcome1: 'Understand Node.js architecture',
          learningOutcome2: 'Work with file system efficiently',
          learningOutcome3: 'Handle errors properly',
          practicalProject: 'Build file processing utility',
          relatedTopics: ['Express Framework', 'API Development', 'Advanced Node']
        },
        {
          title: 'Express.js Framework',
          description: 'Build web applications and APIs with Express.',
          subTopics: ['Express Setup', 'Middleware', 'Routing', 'Request/Response', 'Error Handling'],
          estimatedTime: '10-12 hours',
          keyConcepts: ['Express framework', 'Routing', 'Middleware', 'Error handling', 'Security'],
          learningOutcome1: 'Set up Express applications',
          learningOutcome2: 'Implement routing and middleware',
          learningOutcome3: 'Handle errors and logging',
          practicalProject: 'Build complete REST API',
          relatedTopics: ['Node Fundamentals', 'API Development', 'Database']
        }
      ]
    };

    this.isLoading = false;

    if (topicDatabase[this.subTechnologyId] && topicDatabase[this.subTechnologyId][this.topicIndex]) {
      this.topic = topicDatabase[this.subTechnologyId][this.topicIndex];
    } else {
      this.topic = {
        title: 'Topic Coming Soon',
        description: 'This topic content is being developed.',
        subTopics: ['Content in development'],
        estimatedTime: 'Coming soon',
        keyConcepts: ['Content in development'],
        learningOutcome1: 'Wait for content',
        learningOutcome2: 'Stay tuned',
        learningOutcome3: 'Contact support',
        practicalProject: 'Project details coming soon',
        relatedTopics: []
      };
    }
  }

  goBack(): void {
    this.router.navigate(['/roadmaps', this.technologyId, this.subTechnologyId]);
  }

  selectSubTopic(subTopic: string): void {
    this.selectedSubTopic = subTopic;
    this.loadSubTopicDetails(subTopic);
  }

  closeSubTopic(): void {
    this.selectedSubTopic = null;
    this.subTopicDetails = null;
  }

  loadSubTopicDetails(subTopic: string): void {
    const detailedSubTopicDatabase: any = {
      'html-css': {
        'Document Structure': {
          title: 'HTML Document Structure',
          description: 'Understanding the fundamental structure of every HTML document.',
          content: [
            { heading: 'DOCTYPE Declaration', text: 'The <!DOCTYPE html> declaration must be the very first line. It tells the browser which version of HTML to use.', code: '<!DOCTYPE html>', example: 'Not an HTML tag - an instruction to the browser about HTML version.' },
            { heading: 'HTML Root Element', text: 'The <html> element is the root element containing <head> and <body>.', code: '<html lang="en">...</html>', example: 'The lang attribute is important for accessibility and SEO.' },
            { heading: 'Head Section', text: 'Contains metadata like title, charset, stylesheets, and scripts.', code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Page</title>\n</head>', example: 'Meta charset should come first. Viewport meta tag is crucial for responsiveness.' },
            { heading: 'Body Section', text: 'Contains all visible content - text, images, links, forms.', code: '<body>\n  <h1>Welcome</h1>\n  <p>This is visible content.</p>\n</body>', example: 'All user-facing content goes here with proper semantic elements.' }
          ],
          practicalExample: 'Create a basic HTML document with proper structure.',
          bestPractices: ['Always include DOCTYPE declaration', 'Specify language with lang attribute', 'Set character encoding to UTF-8', 'Include viewport meta tag', 'Keep metadata organized in head']
        },
        'Semantic Elements': {
          title: 'HTML5 Semantic Elements',
          description: 'Use semantic elements to describe content meaning.',
          content: [
            { heading: 'Header Element', text: 'Represents introductory content with logos, navigation, or headings.', code: '<header>\n  <h1>Website Title</h1>\n  <nav>Navigation</nav>\n</header>', example: 'Use one header per page or section.' },
            { heading: 'Navigation Element', text: 'Defines navigation links for main menu or other navigation areas.', code: '<nav>\n  <a href="/home">Home</a>\n  <a href="/about">About</a>\n</nav>', example: 'Use aria-label attributes for multiple navigation areas.' },
            { heading: 'Main Element', text: 'Specifies main content unique to that page.', code: '<main>\n  <h1>Main Content</h1>\n  <article>Article content</article>\n</main>', example: 'Helps screen readers find primary content quickly.' },
            { heading: 'Article Element', text: 'Self-contained composition like blog post or news story.', code: '<article>\n  <header>\n    <h1>Article Title</h1>\n    <time datetime="2024-01-01">January 1, 2024</time>\n  </header>\n  <p>Article content...</p>\n</article>', example: 'Perfect for blog posts or news articles.' }
          ],
          practicalExample: 'Create a webpage using semantic elements.',
          bestPractices: ['Use semantic elements over divs', 'Ensure each sectioning element has a heading', 'Use semantic elements for better SEO', 'Test with screen readers']
        },
        'CSS Syntax': {
          title: 'CSS Syntax Fundamentals',
          description: 'CSS uses specific syntax to define element styling.',
          content: [
            { heading: 'CSS Rule Structure', text: 'Every CSS rule consists of selector and declaration block.', code: 'selector {\n  property: value;\n}', example: 'The selector targets HTML elements. Properties are separated by semicolons.' },
            { heading: 'Element Selectors', text: 'Target all instances of a specified HTML element.', code: 'p {\n  color: blue;\n  font-size: 16px;\n}', example: 'This styles all <p> elements.' },
            { heading: 'Class Selectors', text: 'Target elements with a specific class attribute.', code: '.button {\n  background: blue;\n  color: white;\n}', example: 'Applied like: <button class="button">Click me</button>' },
            { heading: 'ID Selectors', text: 'Target a single unique element with specific ID.', code: '#header {\n  background: #333;\n  color: white;\n}', example: 'Applied like: <header id="header">...</header>' }
          ],
          practicalExample: 'Create stylesheet with different selector types.',
          bestPractices: ['Use class selectors for reusable styles', 'Use ID selectors sparingly', 'Comment your CSS', 'Keep selectors simple']
        },
        'Flexbox': {
          title: 'CSS Flexbox Layout',
          description: 'One-dimensional layout system for spacing and aligning items.',
          content: [
            { heading: 'Flex Container', text: 'Set container to display: flex to enable flexbox.', code: '.container {\n  display: flex;\n}', example: 'Flex container controls how child elements are arranged.' },
            { heading: 'Flex Direction', text: 'Sets the direction of the main axis.', code: 'flex-direction: row; /* or column */', example: 'row arranges items horizontally, column arranges vertically.' },
            { heading: 'Justify Content', text: 'Aligns flex items along the main axis.', code: 'justify-content: center; /* flex-start, flex-end, space-between */', example: 'space-between puts equal space between items.' },
            { heading: 'Flex Wrap', text: 'Controls whether items wrap onto multiple lines.', code: 'flex-wrap: wrap; /* nowrap */', example: 'wrap allows items to flow to next line when they don\'t fit.' }
          ],
          practicalExample: 'Create a responsive navigation bar with flexbox.',
          bestPractices: ['Use flex-wrap for responsive designs', 'Combine justify-content and align-items', 'Use flex-grow for dynamic spacing', 'Test flex layouts']
        }
      },
      'javascript-typescript': {
        'Variables & Types': {
          title: 'JavaScript Variables and Data Types',
          description: 'Understanding variables and data types is fundamental.',
          content: [
            { heading: 'Variable Declaration', text: 'JavaScript provides let, const, and var with different scoping rules.', code: 'let userName = "John";\nconst PI = 3.14159;\nvar oldStyle = "legacy";', example: 'Prefer const by default, use let when reassignment needed.' },
            { heading: 'Primitive Data Types', text: 'Six primitive types: string, number, boolean, null, undefined, symbol.', code: 'let name = "Alice";\nlet age = 25;\nlet isStudent = true;', example: 'Primitives are immutable - stored by value.' },
            { heading: 'Type Coercion', text: 'JavaScript automatically converts between types during operations.', code: 'console.log("5" - 1); // 4\nconsole.log("5" + 1); // "51"', example: 'Use === for strict comparison to avoid type coercion bugs.' }
          ],
          practicalExample: 'Create program using variables and data types.',
          bestPractices: ['Use const by default', 'Avoid var in modern JavaScript', 'Use === for strict comparison', 'Be aware of type coercion']
        },
        'Functions': {
          title: 'JavaScript Functions and Scope',
          description: 'Functions are reusable blocks of code that perform specific tasks.',
          content: [
            { heading: 'Function Declaration', text: 'Named functions that are hoisted - available throughout scope.', code: 'function greet(name) {\n  return "Hello, " + name + "!";\n}', example: 'Function declarations are hoisted.' },
            { heading: 'Arrow Functions', text: 'Concise syntax with different this behavior.', code: 'const greet = (name) => "Hello, " + name + "!";', example: 'Arrow functions inherit this from surrounding scope.' },
            { heading: 'Function Scope', text: 'Variables have block scope - accessible within their block.', code: 'function testScope() {\n  let blockScoped = "inside";\n}', example: 'Block scope prevents variables from leaking outside context.' }
          ],
          practicalExample: 'Create functions with different scopes.',
          bestPractices: ['Use arrow functions for callbacks', 'Limit global variables', 'Use meaningful function names', 'Keep functions focused']
        }
      }
    };

    if (detailedSubTopicDatabase[this.subTechnologyId] && detailedSubTopicDatabase[this.subTechnologyId][subTopic]) {
      this.subTopicDetails = detailedSubTopicDatabase[this.subTechnologyId][subTopic];
    } else {
      this.subTopicDetails = {
        title: 'Sub-Topic Details',
        description: 'Detailed information about this sub-topic is being developed.',
        content: [{
          heading: 'Coming Soon',
          text: 'This sub-topic content is being developed.',
          code: '',
          example: ''
        }],
        practicalExample: 'Content coming soon',
        bestPractices: ['Content in development']
      };
    }
  }
}
