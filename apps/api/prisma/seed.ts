import { prisma } from '../src/utils/prisma'
import { QUEST_SEED_DATA } from '../src/data/quest-seed-data'

async function main(): Promise<void> {
  for (const quest of QUEST_SEED_DATA) {
    await prisma.quest.upsert({
      where: { questCode: quest.questCode },
      update: quest,
      create: quest
    })
  }
  console.log(`[seed] upserted ${QUEST_SEED_DATA.length} quests`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
