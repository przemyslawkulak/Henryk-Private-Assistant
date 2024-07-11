-- CreateTable
CREATE TABLE "Meals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dinner" BOOLEAN NOT NULL DEFAULT false,
    "supper" BOOLEAN NOT NULL DEFAULT false,
    "pasta" BOOLEAN NOT NULL DEFAULT false,
    "groats" BOOLEAN NOT NULL DEFAULT false,
    "rice" BOOLEAN NOT NULL DEFAULT false,
    "potatoes" BOOLEAN NOT NULL DEFAULT false,
    "legumes" BOOLEAN NOT NULL DEFAULT false,
    "tortilla" BOOLEAN NOT NULL DEFAULT false,
    "flatBread" BOOLEAN NOT NULL DEFAULT false,
    "chicken" BOOLEAN NOT NULL DEFAULT false,
    "pork" BOOLEAN NOT NULL DEFAULT false,
    "beef" BOOLEAN NOT NULL DEFAULT false,
    "vege" BOOLEAN NOT NULL DEFAULT false,
    "fish" BOOLEAN NOT NULL DEFAULT false,
    "turkey" BOOLEAN NOT NULL DEFAULT false,
    "ham" BOOLEAN NOT NULL DEFAULT false,
    "soup" BOOLEAN NOT NULL DEFAULT false,
    "salad" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meals_pkey" PRIMARY KEY ("id")
);
