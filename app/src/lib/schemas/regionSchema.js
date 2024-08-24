const { z } = require('zod')

const regionSchema = z.object({
  metadata: z.object({
    sources: z.array(
      // URL link to data source website
      z.string().url().max(200)
    ).min(1),
    // Data set title
    title: z.string().max(50),
    // Data set description
    description: z.string().max(500),
    // Date the data set was first created
    date_created: z.string().length(8),
    // Date the data set was updated
    date_updated: z.string().length(8).optional()
  }),

  data: z.array(
    z.object({
      // Other province name i.e., "Region I, Region II,..."
      name: z.string().max(40),
      // Region name abbreviation i.e., "MIMAROPA, CAR,..."
      abbrev: z.string().max(20).nullable(),
      // Region number i.e. for Region I = 1, Region II = 2
      region_num: z.string().max(5).nullable(),
      // Full Region name i.e., "Cordillera Administrative Region, Ilocos, Davao"
      region_name: z.string(),
      // Province list of the region
      provinces: z.array(
        z.string().max(40)
      ).min(1)
    })
  )
})

module.exports = regionSchema
