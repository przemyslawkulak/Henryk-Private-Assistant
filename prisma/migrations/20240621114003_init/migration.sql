-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "human" TEXT,
    "ai" TEXT,
    "system" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
