-- CreateTable
CREATE TABLE "public"."Author" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "olid" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" SERIAL NOT NULL,
    "authorIds" INTEGER[],
    "description" TEXT NOT NULL,
    "firstPublishedYear" INTEGER NOT NULL,
    "isbn" TEXT[],
    "olid" TEXT NOT NULL,
    "subject" TEXT[],
    "title" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AuthorToBook" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AuthorToBook_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_olid_key" ON "public"."Author"("olid");

-- CreateIndex
CREATE UNIQUE INDEX "Book_olid_key" ON "public"."Book"("olid");

-- CreateIndex
CREATE INDEX "_AuthorToBook_B_index" ON "public"."_AuthorToBook"("B");

-- AddForeignKey
ALTER TABLE "public"."_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
