const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})



  
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('most blogs', () => {
    const blogs = [
      {
        title: 'First Blog',
        author: 'Robert C. Martin',
        url: 'http://example.com',
        likes: 3
      },
      {
        title: 'Second Blog',
        author: 'Robert C. Martin',
        url: 'http://example.com',
        likes: 5
      },
      {
        title: 'Third Blog',
        author: 'John Doe',
        url: 'http://example.com',
        likes: 8
      }
    ]
  
    test('finds the author with the most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      expect(result).toEqual({ author: 'Robert C. Martin', blogs: 2 })
    })
  })

  describe('most likes', () => {
    const blogs = [
      {
        title: 'First Blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com',
        likes: 5
      },
      {
        title: 'Second Blog',
        author: 'Robert C. Martin',
        url: 'http://example.com',
        likes: 10
      },
      {
        title: 'Third Blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com',
        likes: 7
      }
    ]
  
    test('finds the author with the most likes', () => {
      const result = listHelper.mostLikes(blogs)
      expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 12 })
    })
  })
  
  

describe('favorite blog', () => {
  const blogs = [
    // example blogs with different like counts
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.example.com',
      likes: 12,
      __v: 0
    }
  ]

  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})
