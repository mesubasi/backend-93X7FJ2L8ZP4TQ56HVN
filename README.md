# Fullstack Programlama Görevi

## Yükleme

1. **Repository'i klonlayın:**

   ```sh
   git clone https://github.com/mesubasi/backend-93X7FJ2L8ZP4TQ56HVN.git
   cd backend-93X7FJ2L8ZP4TQ56HVN
   ```

2. **Bağımlılıkları Yükleyin:**

   ```sh
   yarn install
   ```

3. **Proje Kök Dizininde Ortam Değişkeni (.env) oluşturun:**

   ```sh
   DB_USERNAME = // postgres - default
   DB_HOST =  // localhost - default
   DB_DATABASE = // postgres - default
   DB_PASSWORD = // postgres - default
   DB_PORT = // 5432 - default
   ```

4. **Projeyi başlatın:**

   ```sh
   yarn start
   ```

5. **API'lere istek atın (Postman vb. araçlar ile):**

   ```sh
   HTTP Methodu : GET
   Açıklama = id yerine verisine ulaşılmak istenen kullanıcının id numarasını yazınız
   ----------------------------------------------------------------------
   Request Url: http://localhost:3000/users/id
   Response:
    "status": 200,
    "data": {
        "id": 500,
        "name": "Lelia",
        "surname": "Hayes",
        "email": "test2312321321321@bihutbu.gn",
        "password": "$2b$10$/vuEYNLOzlo29VhCmsLmpuXuCxwDG77.MUb3yLuDvE/u49lwl1VV.",
        "phone": "23644352834",
        "age": "46",
        "country": "Estonia",
        "district": "Hifhocep",
        "role": "admin",
        "createdat": "2024-10-24T12:27:42.030Z",
        "updatedat": "2024-10-24T12:27:42.030Z"
    }
   ----------------------------------------------------------------------
   HTTP Metodu: POST
   Açıklama: Body değerlerini örnekteki gibi göndererek veritabanına kullanıcıyı kaydedebilirsiniz
   Request Url: http://localhost:3000/users/save
   Body(JSON):
   {
    "name" : "Test",
    "surname" : "Test",
    "email" : "vavu@red.vu",
    "password" : "21312321",
    "phone" : 5426721222,
    "age" : 25,
    "country" : "Turkey",
    "district" : "İnegöl",
    "role" : "User"
   }
   ----------------------------------------------------------------------
   HTTP Metodu: GET
   Açıklama: 1.sayfada içerisinde ma geçen ilk 10 kullanıcıyı getirir. search parametresi opsiyoneldir.
   Request Url: http://localhost:3000/users?page=1&pageSize=10&search=ma
   Örnek Response:
    "status": 200,
    "data": [
        {
            "id": 10,
            "name": "Thomas",
            "surname": "Brogelli",
            "email": "liwgisadsa@duzru.dz",
            "password": "$2b$10$2lvICBfkJqAMsufHZFBG6.EYypK5ykJZ7EDG00A52b.3RDRgs88F.",
            "phone": "25785027432",
            "age": "56",
            "country": "Guernsey",
            "district": "Lebtutu",
            "role": "admin",
            "createdat": "2024-10-23T21:23:48.576Z",
            "updatedat": "2024-10-23T21:23:48.576Z"
        },
      ]
   ----------------------------------------------------------------------
   HTTP Metodu: PUT
   Açıklama: id yerine ilgili kullanıcının değerini girerek ve verilerini Body ile göndererek güncelleyebilirsiniz
   Request Url: http://localhost:3000/users/update/id
   Body (JSON):
   {
    "name" : "TEST",
    "surname" : "TEST",
    "password" : "123",
    "email" : "testertest@gmail.com"
   }
   ```

## Swagger UI Dökümantasyonu

<p>Proje başlatıldıktan sonra http://localhost:3000/swagger adresinden ulaşılabilir</p>
