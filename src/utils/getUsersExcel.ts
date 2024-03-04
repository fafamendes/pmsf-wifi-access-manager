import { AuthService } from '@src/services/auth';
import * as ExcelJS from 'exceljs';

function createPassword(name: string): string {
  const splitedName = name.split(' ');
  return (splitedName[0][0] + splitedName[splitedName.length - 1][0] + '@2024').toLocaleLowerCase();
}


export async function getUsersExcel(filePath: string): Promise<ExcelUser[]> {
  const workbook = new ExcelJS.Workbook();
  const users: ExcelUser[] = [];

  console.log(filePath);
  try {
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    worksheet?.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      const matricula = row.getCell(1).value;
      const nome = row.getCell(2).value;
      const senha = createPassword(nome as string);
      users.push({ name: nome as string, username: matricula as string, password: await AuthService.hashPassword(senha), role: 'USER', status: true });
      console.log(`User: ${matricula} - Senha: ${senha}`);
    });

  } catch (error) {
    console.error('Erro ao ler o arquivo Excel:', error);
  }
  return users;
}
