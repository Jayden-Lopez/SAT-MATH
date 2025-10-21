import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { RefreshCw, Lightbulb, CheckCircle, XCircle, Calendar, Target, BookOpen, ArrowRight, Settings, TrendingDown, Award, BarChart3, Lock, Unlock } from 'lucide-react';

const AdvancedMathTutorial = () => {
  const [topic, setTopic] = useState('quadratics');
  const [lesson, setLesson] = useState(null);
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showLesson, setShowLesson] = useState(true);
  const [parentMode, setParentMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [parentPassword, setParentPassword] = useState(() => {
    const saved = localStorage.getItem('parentPassword');
    return saved || '1234';
  });
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('jaydenMathStats');
    return saved ? JSON.parse(saved) : {
      dailyGoal: 10,
      todayCount: 0,
      lastDate: new Date().toDateString(),
      totalProblems: 0,
      correct: 0,
      topicProgress: {},
      dailyHistory: [],
      strugglingTopics: [],
      recentErrors: []
    };
  });

  // Load from Firebase on startup - ALWAYS prioritize Firebase
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        const docRef = doc(db, 'users', 'jayden');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebaseStats = docSnap.data().stats;
          setStats(firebaseStats);
          // Also save to localStorage so it's available offline
          localStorage.setItem('jaydenMathStats', JSON.stringify(firebaseStats));
          console.log('Loaded from Firebase:', firebaseStats);
        }
      } catch (error) {
        console.error('Error loading from Firebase:', error);
        // If Firebase fails, fall back to localStorage
        const saved = localStorage.getItem('jaydenMathStats');
        if (saved) {
          setStats(JSON.parse(saved));
        }
      }
    };
    loadFromFirebase();
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      // Save yesterday's count to history
      const newHistory = [...(stats.dailyHistory || []), {
        date: stats.lastDate,
        count: stats.todayCount,
        correct: stats.correct
      }].slice(-30); // Keep last 30 days
      
      setStats(prev => ({ 
        ...prev, 
        todayCount: 0, 
        lastDate: today,
        dailyHistory: newHistory
      }));
    }
  }, []);

  useEffect(() => {
  localStorage.setItem('jaydenMathStats', JSON.stringify(stats));
  
  const saveToFirebase = async () => {
    try {
      await setDoc(doc(db, 'users', 'jayden'), {
        stats: stats,
        lastUpdated: new Date().toISOString()
      });
      console.log('✅ Saved to Firebase successfully');
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error);
    }
  };
  
  // Only save if we have actual progress (not initial load)
  if (stats.totalProblems > 0) {
    saveToFirebase();
  }
}, [stats]);

  const satDate = new Date('2025-12-07');
  const today = new Date();
  const daysUntilSAT = Math.ceil((satDate - today) / (1000 * 60 * 60 * 24));

  const topics = {
    quadratics: {
      name: 'Quadratic Equations',
      lesson: {
        title: 'What is a Quadratic Equation?',
        sections: [
          {
            heading: 'The Basics',
            content: `A quadratic equation is any equation where the highest power of x is 2 (x²). It looks like this:\n\nax² + bx + c = 0\n\nExample: x² + 5x + 6 = 0\n\nReal world example: If you throw a ball in the air, its height over time follows a quadratic equation! The highest point (vertex) and when it hits the ground (roots) are what we solve for.`
          },
          {
            heading: 'Why x² Makes It Special',
            content: `When you have x² (x squared), you're dealing with something curved, not straight.\n\nLinear equation: y = 2x + 1 (makes a straight line)\nQuadratic equation: y = x² + 2x + 1 (makes a U-shaped curve called a parabola)\n\nBecause of the curve, quadratics usually have TWO solutions (where the curve crosses the x-axis).`
          },
          {
            heading: 'Three Ways to Solve Quadratics',
            content: `1. FACTORING (easiest when it works)\n   Break the equation into two parts: (x + ?)(x + ?) = 0\n   \n2. QUADRATIC FORMULA (always works!)\n   x = [-b ± √(b² - 4ac)] / (2a)\n   \n3. COMPLETING THE SQUARE (used in advanced problems)\n   Rewrite in vertex form: (x - h)² = k\n\nOn the SAT, factoring and the quadratic formula are most common.`
          }
        ]
      }
    },
    exponents: {
      name: 'Exponents & Radicals',
      lesson: {
        title: 'Understanding Exponents from Scratch',
        sections: [
          {
            heading: 'What Is an Exponent?',
            content: `An exponent tells you how many times to multiply a number by itself.\n\n2³ means: 2 × 2 × 2 = 8\n5² means: 5 × 5 = 25\n\nThe small number (³, ²) is called the exponent or "power".\nThe big number (2, 5) is called the base.\n\nThink of it as "2 to the 3rd power" or "5 squared".`
          },
          {
            heading: 'Special Exponents You Must Know',
            content: `x¹ = x (anything to the power of 1 is itself)\nx⁰ = 1 (anything to the power of 0 is 1, even 1000⁰ = 1!)\n\nNegative exponents mean "reciprocal" (flip it):\n2⁻³ = 1/(2³) = 1/8\n\nFractional exponents mean "root":\n9^(1/2) = √9 = 3 (square root)\n8^(1/3) = ³√8 = 2 (cube root)`
          },
          {
            heading: 'The 5 Essential Exponent Rules',
            content: `When bases are the SAME:\n\n1. Multiplying: x³ × x² = x⁵ (ADD exponents: 3+2=5)\n\n2. Dividing: x⁵ ÷ x² = x³ (SUBTRACT exponents: 5-2=3)\n\n3. Power to a power: (x²)³ = x⁶ (MULTIPLY exponents: 2×3=6)\n\n4. Distribute over multiplication: (2x)³ = 2³ × x³ = 8x³\n\n5. Zero power: x⁰ = 1\n\nThese 5 rules solve 90% of SAT exponent problems!`
          }
        ]
      }
    },
    functions: {
      name: 'Function Notation',
      lesson: {
        title: 'What Are Functions?',
        sections: [
          {
            heading: 'Functions Are Like Machines',
            content: `A function is like a machine: you put something IN, it does something to it, and something comes OUT.\n\nExample: f(x) = 2x + 3\n\nThis function takes any number (x), multiplies it by 2, then adds 3.\n\nIf you put in 5: f(5) = 2(5) + 3 = 10 + 3 = 13\nIf you put in 0: f(0) = 2(0) + 3 = 0 + 3 = 3\n\nThe "f(x)" just means "function of x" - it's the OUTPUT when you input x.`
          },
          {
            heading: 'Reading Function Notation',
            content: `f(x) - pronounced "f of x"\ng(3) - means "use the function g with input 3"\nh(a+b) - means "use function h with input (a+b)"\n\nDon't confuse f(x) with multiplication! It's NOT f times x.\nIt means "the function f evaluated at x".\n\nExample:\nIf f(x) = x² - 4\nThen f(3) = 3² - 4 = 9 - 4 = 5\n\nYou literally just replace every x with 3.`
          },
          {
            heading: 'Composite Functions (Functions Inside Functions)',
            content: `Sometimes you put one function inside another:\n\nf(g(x)) means: First do g, then put that result into f.\n\nExample:\nf(x) = 2x + 1\ng(x) = x²\n\nFind f(g(3)):\nStep 1: g(3) = 3² = 9\nStep 2: f(9) = 2(9) + 1 = 19\n\nSo f(g(3)) = 19\n\nThink of it like: the OUTPUT of g becomes the INPUT of f.`
          }
        ]
      }
    },
    polynomials: {
      name: 'Polynomial Operations',
      lesson: {
        title: 'What Are Polynomials?',
        sections: [
          {
            heading: 'Understanding Polynomials',
            content: `A polynomial is just a fancy word for an expression with multiple terms containing variables with whole number exponents.\n\nExamples of polynomials:\n• 3x² + 2x - 5 (has 3 terms)\n• x⁴ - 2x² + 1 (has 3 terms)\n• 7x - 3 (has 2 terms)\n\nNOT polynomials:\n• 1/x (negative exponent)\n• √x (fractional exponent)\n• x^(1.5) (non-whole number exponent)`
          },
          {
            heading: 'Adding and Subtracting Polynomials',
            content: `The golden rule: You can only combine LIKE TERMS.\n\nLike terms have the SAME variable with the SAME exponent.\n\nExample: Add (3x² + 2x + 5) + (x² - 4x + 2)\n\nGroup like terms:\nx² terms: 3x² + x² = 4x²\nx terms: 2x - 4x = -2x\nConstant terms: 5 + 2 = 7\n\nAnswer: 4x² - 2x + 7\n\nThink of it like: 3 apples + 1 apple = 4 apples, but you can't add apples and oranges!`
          },
          {
            heading: 'Multiplying Polynomials (FOIL)',
            content: `When multiplying (a + b)(c + d), use FOIL:\n\nF - First terms: a × c\nO - Outside terms: a × d  \nI - Inside terms: b × c\nL - Last terms: b × d\n\nExample: (x + 3)(x + 2)\nF: x × x = x²\nO: x × 2 = 2x\nI: 3 × x = 3x\nL: 3 × 2 = 6\n\nCombine: x² + 2x + 3x + 6 = x² + 5x + 6\n\nFOIL is your best friend for binomial multiplication!`
          }
        ]
      }
    }
  };

  const generateProblem = (selectedTopic) => {
  // Calculate difficulty level based on topic performance
  const topicData = stats.topicProgress[selectedTopic];
  let difficultyLevel = 'easy'; // Start easy
  
  if (topicData && topicData.total >= 5) {
    const accuracy = (topicData.correct / topicData.total) * 100;
    if (accuracy >= 80) {
      difficultyLevel = 'hard'; // Mastered - give hard problems
    } else if (accuracy >= 60) {
      difficultyLevel = 'medium'; // Improving - give medium problems
    }
    // Below 60% stays on easy
  }
  
  console.log(`Generating ${difficultyLevel} problem for ${selectedTopic}. Accuracy: ${topicData ? ((topicData.correct / topicData.total) * 100).toFixed(0) : 0}%`);

  const problems = {
    quadratics: () => {
      if (difficultyLevel === 'easy') {
        // Easy: Simple factoring with small numbers
        const root1 = Math.floor(Math.random() * 3) + 1; // 1-3
        const root2 = Math.floor(Math.random() * 3) + 1; // 1-3
        const b = -(root1 + root2);
        const c = root1 * root2;
        
        return {
          question: `Factor and solve: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\n\nGive both solutions separated by comma (smaller first).`,
          answer: `${Math.min(root1, root2)},${Math.max(root1, root2)}`,
          type: 'text',
          hints: [
            {
              title: "Let's Start From Zero",
              content: `We need to factor: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}\n\nFactoring means rewriting this as two parts multiplied together:\n(x + ?)(x + ?) = 0\n\nWhy? Because if two things multiply to give zero, one of them MUST be zero!`
            },
            {
              title: "Finding the Magic Numbers",
              content: `We need two numbers that:\n1. MULTIPLY to give ${c}\n2. ADD to give ${b}\n\nThe answer: ${root1} and ${root2}\nCheck: ${root1} × ${root2} = ${c} ✓`
            },
            {
              title: "Solving for x",
              content: `(x - ${root1})(x - ${root2}) = 0\n\nEither x - ${root1} = 0  →  x = ${root1}\nOr x - ${root2} = 0  →  x = ${root2}\n\nSolutions: x = ${Math.min(root1, root2)} and x = ${Math.max(root1, root2)}`
            }
          ],
          difficulty: 'Easy',
          satSection: 'Passport to Advanced Math'
        };
      } else if (difficultyLevel === 'medium') {
        // Medium: Larger numbers or negative roots
        const root1 = Math.floor(Math.random() * 5) + 2; // 2-6
        const root2 = Math.floor(Math.random() * 5) + 2; // 2-6
        const b = -(root1 + root2);
        const c = root1 * root2;
        
        return {
          question: `Factor and solve: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\n\nGive both solutions separated by comma (smaller first).`,
          answer: `${Math.min(root1, root2)},${Math.max(root1, root2)}`,
          type: 'text',
          hints: [
            {
              title: "Let's Start From Zero",
              content: `We need to factor: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}\n\nFactoring means rewriting this as two parts multiplied together:\n(x + ?)(x + ?) = 0`
            },
            {
              title: "Finding the Numbers",
              content: `We need two numbers that:\n1. MULTIPLY to give ${c}\n2. ADD to give ${b}\n\nTry different factor pairs of ${c} until you find the pair that adds to ${b}.`
            },
            {
              title: "Solution",
              content: `The answers are ${root1} and ${root2}\n(x - ${root1})(x - ${root2}) = 0\nSolutions: x = ${Math.min(root1, root2)}, ${Math.max(root1, root2)}`
            }
          ],
          difficulty: 'Medium',
          satSection: 'Passport to Advanced Math'
        };
      } else {
        // Hard: Quadratic formula required
        const a = 1;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 5) + 1;
        const discriminant = b * b - 4 * a * c;
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        return {
          question: `Use the quadratic formula to solve:\nx² + ${b}x + ${c} = 0\n\nGive the larger solution (round to 2 decimals).`,
          answer: x1.toFixed(2),
          type: 'numeric',
          hints: [
            {
              title: "The Quadratic Formula",
              content: `x = [-b ± √(b² - 4ac)] / (2a)\n\nFor our equation: a = 1, b = ${b}, c = ${c}`
            },
            {
              title: "Calculate the Discriminant",
              content: `b² - 4ac = ${b}² - 4(1)(${c}) = ${discriminant}`
            },
            {
              title: "Apply the Formula",
              content: `x = [-${b} + √${discriminant}] / 2 = ${x1.toFixed(2)}`
            }
          ],
          difficulty: 'Hard',
          satSection: 'Passport to Advanced Math'
        };
      }
    },
    
    exponents: () => {
      if (difficultyLevel === 'easy') {
        // Easy: Basic multiplication rule
        const base = [2, 3][Math.floor(Math.random() * 2)];
        const exp1 = Math.floor(Math.random() * 3) + 2; // 2-4
        const exp2 = Math.floor(Math.random() * 2) + 1; // 1-2
        const answer = exp1 + exp2;
        
        return {
          question: `Simplify: ${base}^${exp1} × ${base}^${exp2}\n\nExpress as ${base}^n. What is n?`,
          answer: String(answer),
          type: 'numeric',
          hints: [
            {
              title: "Multiplication Rule",
              content: `When multiplying same bases: ADD exponents\n\na^m × a^n = a^(m+n)`
            },
            {
              title: "Apply the Rule",
              content: `${base}^${exp1} × ${base}^${exp2} = ${base}^(${exp1}+${exp2}) = ${base}^${answer}`
            }
          ],
          difficulty: 'Easy',
          satSection: 'Passport to Advanced Math'
        };
      } else if (difficultyLevel === 'medium') {
        // Medium: Division or negative exponents
        const base = [2, 3, 4][Math.floor(Math.random() * 3)];
        const exp = Math.floor(Math.random() * 3) + 2;
        const answer = 1 / Math.pow(base, exp);
        
        return {
          question: `Evaluate: ${base}^(-${exp})\n\nExpress as a decimal (round to 4 decimals).`,
          answer: answer.toFixed(4),
          type: 'numeric',
          hints: [
            {
              title: "Negative Exponent Rule",
              content: `a^(-n) = 1/(a^n)\n\nNegative exponent means "flip it"`
            },
            {
              title: "Calculate",
              content: `${base}^(-${exp}) = 1/(${base}^${exp}) = 1/${Math.pow(base, exp)} = ${answer.toFixed(4)}`
            }
          ],
          difficulty: 'Medium',
          satSection: 'Passport to Advanced Math'
        };
      } else {
        // Hard: Combined operations
        const base = [2, 3, 5][Math.floor(Math.random() * 3)];
        const exp1 = Math.floor(Math.random() * 4) + 2;
        const exp2 = Math.floor(Math.random() * 3) + 1;
        const exp3 = Math.floor(Math.random() * 2) + 1;
        const answer = exp1 * exp2 - exp3;
        
        return {
          question: `Simplify: (${base}^${exp1})^${exp2} ÷ ${base}^${exp3}\n\nExpress as ${base}^n. What is n?`,
          answer: String(answer),
          type: 'numeric',
          hints: [
            {
              title: "Two Rules Combined",
              content: `Power to a power: (a^m)^n = a^(m×n)\nDivision: a^m ÷ a^n = a^(m-n)`
            },
            {
              title: "Step 1",
              content: `(${base}^${exp1})^${exp2} = ${base}^(${exp1}×${exp2}) = ${base}^${exp1 * exp2}`
            },
            {
              title: "Step 2",
              content: `${base}^${exp1 * exp2} ÷ ${base}^${exp3} = ${base}^(${exp1 * exp2}-${exp3}) = ${base}^${answer}`
            }
          ],
          difficulty: 'Hard',
          satSection: 'Passport to Advanced Math'
        };
      }
    },
    
    functions: () => {
      if (difficultyLevel === 'easy') {
        // Easy: Simple linear function
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 6) + 1;
        const input = Math.floor(Math.random() * 5) + 1;
        const answer = a * input + b;
        
        return {
          question: `If f(x) = ${a}x + ${b}, what is f(${input})?`,
          answer: String(answer),
          type: 'numeric',
          hints: [
            {
              title: "Function Evaluation",
              content: `Replace x with ${input} in the function`
            },
            {
              title: "Calculate",
              content: `f(${input}) = ${a}(${input}) + ${b} = ${a * input} + ${b} = ${answer}`
            }
          ],
          difficulty: 'Easy',
          satSection: 'Passport to Advanced Math'
        };
      } else if (difficultyLevel === 'medium') {
        // Medium: Quadratic function
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 6) - 3;
        const input = Math.floor(Math.random() * 4) + 2;
        const answer = a * input * input + b;
        
        return {
          question: `If g(x) = ${a}x² ${b >= 0 ? '+' : ''}${b}, what is g(${input})?`,
          answer: String(answer),
          type: 'numeric',
          hints: [
            {
              title: "With Exponents",
              content: `Replace x with ${input}: g(${input}) = ${a}(${input})² ${b >= 0 ? '+' : ''}${b}`
            },
            {
              title: "Calculate",
              content: `= ${a}(${input * input}) ${b >= 0 ? '+' : ''}${b} = ${a * input * input} ${b >= 0 ? '+' : ''}${b} = ${answer}`
            }
          ],
          difficulty: 'Medium',
          satSection: 'Passport to Advanced Math'
        };
      } else {
        // Hard: Composite functions
        const a = Math.floor(Math.random() * 3) + 2;
        const b = Math.floor(Math.random() * 4) + 1;
        const input = Math.floor(Math.random() * 3) + 2;
        const gResult = input * input;
        const answer = a * gResult + b;
        
        return {
          question: `If f(x) = ${a}x + ${b} and g(x) = x², what is f(g(${input}))?`,
          answer: String(answer),
          type: 'numeric',
          hints: [
            {
              title: "Composite Functions",
              content: `f(g(${input})) means: First find g(${input}), then plug that into f`
            },
            {
              title: "Step 1: Find g(${input})",
              content: `g(${input}) = ${input}² = ${gResult}`
            },
            {
              title: "Step 2: Find f(${gResult})",
              content: `f(${gResult}) = ${a}(${gResult}) + ${b} = ${a * gResult} + ${b} = ${answer}`
            }
          ],
          difficulty: 'Hard',
          satSection: 'Passport to Advanced Math'
        };
      }
    },
    
    polynomials: () => {
      if (difficultyLevel === 'easy') {
        // Easy: Small numbers FOIL
        const a = Math.floor(Math.random() * 3) + 2;
        const b = Math.floor(Math.random() * 3) + 2;
        const answerC = a + b;
        
        return {
          question: `Multiply: (x + ${a})(x + ${b})\n\nWhat is the coefficient of x in the result?`,
          answer: String(answerC),
          type: 'numeric',
          hints: [
            {
              title: "FOIL Method",
              content: `First: x × x = x²\nOutside: x × ${b} = ${b}x\nInside: ${a} × x = ${a}x\nLast: ${a} × ${b} = ${a * b}`
            },
            {
              title: "Combine",
              content: `x² + ${b}x + ${a}x + ${a * b} = x² + ${answerC}x + ${a * b}`
            }
          ],
          difficulty: 'Easy',
          satSection: 'Passport to Advanced Math'
        };
      } else if (difficultyLevel === 'medium') {
        // Medium: Larger numbers or negatives
        const a = Math.floor(Math.random() * 6) + 3;
        const b = Math.floor(Math.random() * 6) + 3;
        const answerC = a + b;
        
        return {
          question: `Multiply: (x + ${a})(x + ${b})\n\nWhat is the coefficient of x in the result?`,
          answer: String(answerC),
          type: 'numeric',
          hints: [
            {
              title: "FOIL Method",
              content: `First: x × x = x²\nOutside: x × ${b} = ${b}x\nInside: ${a} × x = ${a}x\nLast: ${a} × ${b} = ${a * b}`
            },
            {
              title: "Combine",
              content: `The x terms: ${b}x + ${a}x = ${answerC}x`
            }
          ],
          difficulty: 'Medium',
          satSection: 'Passport to Advanced Math'
        };
      } else {
        // Hard: With subtraction
        const a = Math.floor(Math.random() * 5) + 3;
        const b = Math.floor(Math.random() * 4) + 2;
        const answerC = a - b;
        
        return {
          question: `Multiply: (x + ${a})(x - ${b})\n\nWhat is the coefficient of x in the result?`,
          answer: String(answerC),
          type: 'numeric',
          hints: [
            {
              title: "FOIL with Negative",
              content: `First: x × x = x²\nOutside: x × (-${b}) = -${b}x\nInside: ${a} × x = ${a}x\nLast: ${a} × (-${b}) = -${a * b}`
            },
            {
              title: "Combine",
              content: `The x terms: ${a}x - ${b}x = ${answerC}x`
            }
          ],
          difficulty: 'Hard',
          satSection: 'Passport to Advanced Math'
        };
      }
    }
  };

  return problems[selectedTopic]();
};

  const checkAnswer = () => {
    const userAns = userAnswer.trim().toLowerCase().replace(/\s/g, '');
    const correctAns = problem.answer.toLowerCase().replace(/\s/g, '');
    
    let isCorrect = false;
    
    if (problem.type === 'numeric') {
      const userNum = parseFloat(userAns);
      const correctNum = parseFloat(correctAns);
      isCorrect = Math.abs(userNum - correctNum) < 0.01;
    } else {
      isCorrect = userAns === correctAns || userAns.includes(correctAns) || correctAns.includes(userAns);
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // Track errors for parent dashboard
    if (!isCorrect) {
      const errorRecord = {
        topic: topic,
        question: problem.question,
        userAnswer: userAnswer,
        correctAnswer: problem.answer,
        timestamp: new Date().toISOString(),
        hintsUsed: showHint ? hintLevel + 1 : 0
      };
      
      setStats(prev => ({
        ...prev,
        recentErrors: [...(prev.recentErrors || []), errorRecord].slice(-20) // Keep last 20 errors
      }));
    }
    
    setStats(prev => {
      const newTodayCount = prev.todayCount + 1;
      const newTopicProgress = {
        ...prev.topicProgress,
        [topic]: {
          total: (prev.topicProgress[topic]?.total || 0) + 1,
          correct: (prev.topicProgress[topic]?.correct || 0) + (isCorrect ? 1 : 0),
          lastAttempt: new Date().toISOString()
        }
      };
      
      // Identify struggling topics (less than 60% accuracy with at least 5 attempts)
      const strugglingTopics = Object.entries(newTopicProgress)
        .filter(([_, data]) => data.total >= 5 && (data.correct / data.total) < 0.6)
        .map(([topicName, data]) => ({
          topic: topicName,
          accuracy: ((data.correct / data.total) * 100).toFixed(0),
          attempts: data.total
        }));
      
      return {
        ...prev,
        todayCount: newTodayCount,
        totalProblems: prev.totalProblems + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        topicProgress: newTopicProgress,
        strugglingTopics
      };
    });
  };

  const nextProblem = () => {
    setProblem(generateProblem(topic));
    setUserAnswer('');
    setShowHint(false);
    setHintLevel(0);
    setFeedback(null);
    setShowLesson(false);
  };

  const showNextHint = () => {
    if (hintLevel < problem.hints.length - 1) {
      setHintLevel(hintLevel + 1);
    }
    setShowHint(true);
  };

  const startTopic = () => {
    setShowLesson(false);
    nextProblem();
  };

  const handleParentLogin = () => {
    if (passwordInput === parentPassword) {
      setParentMode(true);
      setIsLocked(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const changePassword = () => {
  if (!newPassword || newPassword.length < 4) {
    alert('Password must be at least 4 characters');
    return;
  }
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  setParentPassword(newPassword);
  localStorage.setItem('parentPassword', newPassword);
  setNewPassword('');
  setConfirmPassword('');
  setShowPasswordChange(false);
  alert('Password updated successfully!');
};

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      setStats({
        dailyGoal: 10,
        todayCount: 0,
        lastDate: new Date().toDateString(),
        totalProblems: 0,
        correct: 0,
        topicProgress: {},
        dailyHistory: [],
        strugglingTopics: [],
        recentErrors: []
      });
      alert('Progress has been reset.');
    }
  };

  const resetTopic = (topicKey) => {
    if (window.confirm(`Reset progress for ${topics[topicKey].name}?`)) {
      setStats(prev => ({
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicKey]: { total: 0, correct: 0 }
        }
      }));
    }
  };

  const changeDailyGoal = (newGoal) => {
    setStats(prev => ({ ...prev, dailyGoal: parseInt(newGoal) }));
  };

  useEffect(() => {
    setShowLesson(true);
    setLesson(topics[topic].lesson);
  }, [topic]);

  const progressPercent = (stats.todayCount / stats.dailyGoal) * 100;
  const accuracy = stats.totalProblems > 0 ? ((stats.correct / stats.totalProblems) * 100).toFixed(0) : 0;

  // Parent Dashboard
  if (parentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Goal (problems per day)
                </label>
                <select 
                  value={stats.dailyGoal}
                  onChange={(e) => changeDailyGoal(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg p-2"
                >
                  <option value="5">5 problems</option>
                  <option value="10">10 problems (recommended)</option>
                  <option value="15">15 problems</option>
                  <option value="20">20 problems</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">Change Parent Password</h3>
                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                ) : (
                  <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password (min 4 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-2"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-2"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={changePassword}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Save Password
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Current password: {parentPassword}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={resetAllProgress}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Reset All Progress
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  This will delete all progress data. Use only if starting fresh.
                </p>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-sm text-gray-600 mb-1">Total Problems</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalProblems}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-sm text-gray-600 mb-1">Overall Accuracy</div>
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-sm text-gray-600 mb-1">Today's Progress</div>
              <div className="text-3xl font-bold text-purple-600">{stats.todayCount}/{stats.dailyGoal}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-sm text-gray-600 mb-1">Days Until SAT</div>
              <div className="text-3xl font-bold text-red-600">{daysUntilSAT}</div>
            </div>
          </div>

          {/* Struggling Topics */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold">Areas Needing Attention</h2>
            </div>
            {stats.strugglingTopics && stats.strugglingTopics.length > 0 ? (
              <div className="space-y-3">
                {stats.strugglingTopics.map((item, idx) => (
                  <div key={idx} className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">{topics[item.topic]?.name || item.topic}</div>
                        <div className="text-sm text-gray-600">
                          {item.attempts} attempts • {item.accuracy}% accuracy
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{item.accuracy}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No struggling topics identified yet. Keep practicing!</p>
            )}
          </div>

          {/* Topic Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Performance by Topic</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(topics).map(([key, value]) => {
                const topicData = stats.topicProgress[key];
                const topicAccuracy = topicData && topicData.total > 0 
                  ? ((topicData.correct / topicData.total) * 100).toFixed(0) 
                  : 0;
                const attempts = topicData?.total || 0;
                
                return (
                  <div key={key} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">{value.name}</div>
                        <div className="text-sm text-gray-600">
                          {attempts} problems • {topicData?.correct || 0} correct
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl font-bold ${
                          topicAccuracy >= 80 ? 'text-green-600' : 
                          topicAccuracy >= 60 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {topicAccuracy}%
                        </div>
                        <button
                          onClick={() => resetTopic(key)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          topicAccuracy >= 80 ? 'bg-green-600' : 
                          topicAccuracy >= 60 ? 'bg-yellow-600' : 
                          'bg-red-600'
                        }`}
                        style={{width: `${topicAccuracy}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Errors */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Mistakes (Last 10)</h2>
            {stats.recentErrors && stats.recentErrors.length > 0 ? (
              <div className="space-y-4">
                {stats.recentErrors.slice(-10).reverse().map((error, idx) => (
                  <div key={idx} className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                    <div className="font-semibold text-gray-800 mb-1">
                      {topics[error.topic]?.name || error.topic}
                    </div>
                    <div className="text-sm text-gray-700 mb-2 whitespace-pre-line">
                      {error.question}
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600 font-medium">Jayden's answer: {error.userAnswer}</span>
                      {' • '}
                      <span className="text-green-600 font-medium">Correct: {error.correctAnswer}</span>
                      {error.hintsUsed > 0 && (
                        <span className="text-gray-600"> • Used {error.hintsUsed} hint{error.hintsUsed > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(error.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No errors recorded yet.</p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Goal (problems per day)
                </label>
                <select 
                  value={stats.dailyGoal}
                  onChange={(e) => changeDailyGoal(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg p-2"
                >
                  <option value="5">5 problems</option>
                  <option value="10">10 problems (recommended)</option>
                  <option value="15">15 problems</option>
                  <option value="20">20 problems</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={resetAllProgress}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Reset All Progress
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  This will delete all progress data. Use only if starting fresh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student View (with lock button)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Parent Lock */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-12 h-12 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Jayden's Advanced Math Tutorial</h1>
                <p className="text-gray-600 mt-1">Building strong foundations step-by-step</p>
              </div>
            </div>
            {isLocked ? (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleParentLogin()}
                  placeholder="Parent password"
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={handleParentLogin}
                  className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                  <Lock className="w-4 h-4" />
                  Parent
                </button>
              </div>
            ) : (
              <button
                onClick={() => setParentMode(true)}
                className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                <Unlock className="w-4 h-4" />
                Parent View
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-600">SAT Countdown</span>
              </div>
              <div className="text-2xl font-bold text-red-700">{daysUntilSAT} days</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-600">Today's Goal</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{stats.todayCount}/{stats.dailyGoal}</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${Math.min(progressPercent, 100)}%`}}></div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{accuracy}%</div>
              <div className="text-xs text-green-600 mt-1">{stats.correct} of {stats.totalProblems} correct</div>
            </div>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose a Topic to Learn</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(topics).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTopic(key)}
                className={`p-4 rounded-lg font-medium transition-all text-left ${
                  topic === key
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{value.name}</div>
                {stats.topicProgress[key] && (
                  <div className="text-xs mt-2 opacity-90">
                    {stats.topicProgress[key].correct}/{stats.topicProgress[key].total} correct
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Content */}
        {showLesson && lesson && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
            </div>
            
            {lesson.sections.map((section, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">{section.heading}</h3>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
                {idx < lesson.sections.length - 1 && <hr className="mt-6 border-gray-200" />}
              </div>
            ))}
            
            <button
              onClick={startTopic}
              className="mt-8 w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Practice Problems <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Problem Card */}
        {!showLesson && problem && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-sm font-semibold text-purple-600">{problem.satSection}</span>
                <span className="text-sm text-gray-500 ml-3">Difficulty: {problem.difficulty}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLesson(true)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Review Lesson
                </button>
                <button
                  onClick={nextProblem}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Problem
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xl font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                {problem.question}
              </p>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                placeholder="Type your answer here"
                disabled={feedback !== null}
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div className="flex gap-3">
              {!feedback && (
                <>
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={showNextHint}
                    className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                    {showHint ? `Next Hint (${hintLevel + 1}/${problem.hints.length})` : 'Get Help'}
                  </button>
                </>
              )}
              {feedback && (
                <button
                  onClick={nextProblem}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Next Problem →
                </button>
              )}
            </div>

            {feedback && (
              <div className={`mt-6 p-5 rounded-lg ${
                feedback === 'correct' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle className="w-7 h-7 text-green-600" />
                      <span className="text-xl font-bold text-green-800">Excellent Work, Jayden! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-7 h-7 text-red-600" />
                      <span className="text-xl font-bold text-red-800">Not Quite - Let's Learn!</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 text-lg">
                  The correct answer is: <span className="font-bold text-lg">{problem.answer}</span>
                </p>
                {feedback === 'incorrect' && (
                  <p className="text-gray-600 mt-2">Review the hints below to understand the steps!</p>
                )}
              </div>
            )}

            {showHint && (
              <div className="mt-6 space-y-4">
                {problem.hints.slice(0, hintLevel + 1).map((hint, index) => (
                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg">
                    <h3 className="font-bold text-yellow-900 text-lg mb-2">{hint.title}</h3>
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{hint.content}</p>
                  </div>
                ))}
                {hintLevel < problem.hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="text-yellow-700 hover:text-yellow-800 font-semibold flex items-center gap-2"
                  >
                    Show next step <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {stats.todayCount < stats.dailyGoal && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-center">
            <p className="text-blue-800 font-semibold text-lg">
              💪 Keep going! {stats.dailyGoal - stats.todayCount} more problem{stats.dailyGoal - stats.todayCount !== 1 ? 's' : ''} to reach today's goal!
            </p>
          </div>
        )}

        {stats.todayCount >= stats.dailyGoal && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center">
            <p className="text-green-800 font-bold text-xl">
              🎉 Goal Complete! You've done {stats.todayCount} problems today - Amazing work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedMathTutorial;
