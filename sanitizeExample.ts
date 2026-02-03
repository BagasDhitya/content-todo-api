// sanitize -> membersihkan/menormalkan data dari user sebelum dipakai atau disimpen

// bedanya dengan validation apa?
// validation -> cek boleh/tidak
// sanitization -> clearing unused char

// Kegunaan input sanitize:
// 1. mencegah XSS (cross site scripting)
// 2. mencegah SQL injection
// 3. menjaga konsistensi data
// 4. preventing error/crash akibat input aneh
// 5. termasuk salah satu best practice OWASP Top 10

// -- sanitize string
// use case : input nama user
function sanitizeText(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

const username: string = "<b>John Doe</b>";
// console.log(sanitizeText(username));

// sanitize number
// use case : user ngirim umur, tapi isinya campur
function sanitizeNumber(input: string) {
  const cleaned = input.replace(/[^0-9]/g, "");
  return cleaned ? Number(cleaned) : null;
}

console.log(sanitizeNumber("20 Tahun"));
console.log(sanitizeNumber("18th"));

// sanitize SQL
// function getData(id: string){
//     const query = `SELECT * FROM employee WHERE id = $1`
// }

function sanitizeSQL(input: string){
    return input.replace(/['";-]/g, "")
}

console.log(sanitizeSQL("admin' OR '1'='1"))