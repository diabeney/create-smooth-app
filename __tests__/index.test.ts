// import { join } from 'path';
// import { CLI } from "../src/cli/cli";
const fs = require("fs");
const { join, resolve } = require("path");

export function getTmplDir({ type }) {
  const files = fs.readdirSync(join(process.cwd(), "src", "templates"));
  const isValidType = files.includes(type);
  if (isValidType) {
    return resolve(join(process.cwd(), `templates/${type}`));
  }
}

describe("Template Directory", () => {
  test("Path of template", () => {
    expect(
      getTmplDir({
        type: "npm",
      })
    ).toBe(join(process.cwd(), "templates/npm"));
  });
});

// type CLIResponse = {
//   name: string;
//   type: "npm" | "express";
//   configs: {
//     npm: {
//       nodeModuleFormat: "cjs" | "esm";
//     };
//   };
// };

// describe("CLI Object", () => {
//   test("Get actual data from cli run", async () => {
//     const response = await CLI.Run();
//     expect(response).toMatchObject<CLIResponse>({
//       name: "diabene",
//       type: "npm",
//       configs: {
//         npm: {
//           nodeModuleFormat: "esm",
//         },
//       },
//     });
//   });
// });
