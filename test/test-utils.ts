export function parseCookie(cookieString: string): string {
  const keyValuePairs = cookieString.split('; ');
  const expressSidPair = keyValuePairs.find((pair) =>
    pair.startsWith('express.sid='),
  );
  if (expressSidPair) {
    return expressSidPair;
  } else {
    throw new Error('Cookie не парсится');
  }
}

export function mockProblemLibraries() {
  jest.mock('@nestjs-modules/mailer/dist/adapters/handlebars.adapter', () => {
    return {
      HandlebarsAdapter: jest.fn(() => ({
        compile: jest.fn(),
      })),
    };
  });

  jest.mock('aws-sdk', () => {
    return {
      S3: jest.fn(), // Completely blank mock for S3
    };
  });
}
