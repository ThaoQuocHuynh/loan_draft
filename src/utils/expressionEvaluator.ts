import { User } from "@/types/user";

// Define the context that will be available to expressions
interface ExpressionContext {
  user: User;
  hasRole: (role: string) => boolean;
  hasClaim: (claim: string) => boolean;
  hasPolicy: (policy: string) => boolean;
}

// Whitelist of allowed functions and properties
const ALLOWED_FUNCTIONS = [
  'hasRole',
  'hasClaim',
  'hasPolicy',
  'includes',
  'some',
  'every',
  'filter',
  'map',
  'reduce',
  'length',
  'toLowerCase',
  'toUpperCase',
  'trim',
  'split',
  'join',
  'concat',
  'slice',
  'substring',
  'indexOf',
  'lastIndexOf',
  'startsWith',
  'endsWith',
  'replace',
  'match',
  'test',
  'toString',
  'valueOf',
];

// Create a proxy to restrict access to only allowed properties and functions
function createSafeContext(context: ExpressionContext) {
  return new Proxy(context, {
    get(target, prop) {
      if (typeof prop === 'string' && ALLOWED_FUNCTIONS.includes(prop)) {
        return target[prop as keyof ExpressionContext];
      }
      throw new Error(`Access to property "${String(prop)}" is not allowed in visibility expressions`);
    }
  });
}

/**
 * Safely evaluates a visibility expression
 * @param expression The JavaScript expression to evaluate
 * @param context The context containing user and permission information
 * @returns The result of the expression evaluation or false if evaluation fails
 */
export function evaluateVisibilityExpression(
  expression: string,
  context: ExpressionContext
): boolean {
  if (!expression?.trim()) {
    return true; // Empty expression means always visible
  }

  try {
    // Create a safe context with restricted access
    const safeContext = createSafeContext(context);

    // Create a function that only has access to the safe context
    const evaluator = new Function(
      'context',
      `with(context) { return ${expression}; }`
    );

    // Execute the expression in a try-catch block
    const result = evaluator(safeContext);

    // Ensure the result is a boolean
    return Boolean(result);
  } catch (error) {
    console.error('Error evaluating visibility expression:', error);
    return false; // Default to not visible if there's an error
  }
} 