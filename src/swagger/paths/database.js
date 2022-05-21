const paths = {
  '/api/database': {
    get: {
      tags: ['Database'],
      summary: "Download database's DDL",
      description:
        'Download database`s DDL (Data Definition Language) statements.',
    },
  },
}

export default paths
