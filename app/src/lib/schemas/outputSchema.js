const { z } = require('zod')

// Province name schema
const provinceSchema = z.string().max(40)

// JSON output schema
const outputSchema = z.object({
  metadata: z.object({
    source: z.string(
      // URL link to local or remote Excel file data source website
      z.string().url().max(200)
    ),
    // Data set title
    title: z.string().max(50),
    // Data set description
    description: z.string().max(500),
    // Date the data set was first created
    date_created: z.string().max(20)
  }),

  // Keys are province names (Strings)
  data: z.record(
    // Key-values (municipality names) are arrays of strings
    z.array(z.string().max(40)).refine((data) => {
      // Each province name-key should have max length of 40
      return Object.keys(data)
        .every(province => provinceSchema.safeParse(province).success)
    })
  )
})

module.exports = outputSchema
