type User = {
  name: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'USER';
  status: boolean;
}
type ExcelUser = User