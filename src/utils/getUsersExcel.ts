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

    worksheet?.eachRow({ includeEmpty: false }, async function (row, rowNumber) {
      console.log(((rowNumber + 1) / worksheet.rowCount * 100).toFixed(2), '% concluído');
      const username = row.getCell(1).value as string;
      const name = row.getCell(2).value as string;
      let password = createPassword(name);
      
      users.push({ name, username, password, role: 'USER', status: true });
    });

  } catch (error) {
    console.error('Erro ao ler o arquivo Excel:', error);
  }
  return users;
}
