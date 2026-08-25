import { assert } from 'chai';
import includeFolder from 'include-folder';
import mockdate from 'mockdate';
import { after, before, it } from 'mocha';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Podcast = require('..');

const expectedOutput = includeFolder(
  fileURLToPath(new URL('./expectedOutput', import.meta.url)),
  /.*\.xml$/
);

before(() => {
  // Dates in XML files will always be this value.
  mockdate.set('Wed, 10 Dec 2014 19:04:57 GMT');
});

after(() => {
  mockdate.reset();
});

it('empty feed', () => {
  const feed = new Podcast();
  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.default.trim());
  feed.addItem();
  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.defaultOneItem.trim());
});

it('formats iTunes explicit values', () => {
  for (const [value, expected] of [
    [true, 'true'],
    [false, 'false'],
    ['yes', 'yes'],
    ['no', 'no'],
    ['clean', 'clean'],
    ['invalid', 'false'],
    [1, 'false']
  ]) {
    const feed = new Podcast({ itunesExplicit: value });
    feed.addItem({ itunesExplicit: value });
    const xml = feed.buildXml();

    assert.strictEqual(
      (xml.match(new RegExp(`<itunes:explicit>${expected}</itunes:explicit>`, 'g')) || []).length,
      2
    );
  }
});

it('podcast', () => {
  const feed = new Podcast({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    author: 'Dylan Greene',
    pubDate: 'May 20, 2012 04:00:00 GMT',
    language: 'en',
    ttl: '60',
    itunesSubtitle: 'A show about everything',
    itunesAuthor: 'John Doe',
    itunesSummary:
      'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
    itunesOwner: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Technology',
        subcats: [
          {
            text: 'Software',
            subcats: [
              {
                text: 'node.js'
              }
            ]
          }
        ]
      }
    ]
  });

  feed.addItem({
    title: 'item 1',
    description: 'description 1',
    url: 'http://example.com/article1',
    date: 'May 24, 2012 04:00:00 GMT',
    itunesAuthor: 'John Doe',
    itunesSubtitle: 'A short primer on table spices',
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
    itunesDuration: 424,
    itunesEpisode: 1,
    itunesSeason: 1,
    itunesTitle: 'itunes item 1',
    itunesEpisodeType: 'full'
  });

  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.podcast.trim());
});
it('podcast with new feed url', () => {
  const feed = new Podcast({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    author: 'Dylan Greene',
    pubDate: 'May 20, 2012 04:00:00 GMT',
    language: 'en',
    ttl: '60',
    itunesSubtitle: 'A show about everything',
    itunesAuthor: 'John Doe',
    itunesSummary:
      'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
    itunesOwner: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Technology',
        subcats: [
          {
            text: 'Software',
            subcats: [
              {
                text: 'node.js'
              }
            ]
          }
        ]
      }
    ]
  });

  feed.addItem({
    title: 'item 1',
    description: 'description 1',
    url: 'http://example.com/article1',
    date: 'May 24, 2012 04:00:00 GMT',
    itunesAuthor: 'John Doe',
    itunesSubtitle: 'A short primer on table spices',
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
    itunesDuration: '7:04',
    itunesEpisode: 1,
    itunesSeason: 1,
    itunesTitle: 'itunes item 1',
    itunesEpisodeType: 'full',
    itunesNewFeedUrl: 'https://newlocation.com/example.rss'
  });

  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.podcastWithNewFeedUrl.trim());
});
it('podcast using contructor with items', () => {
  const feedInfo = {
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    author: 'Dylan Greene',
    pubDate: 'May 20, 2012 04:00:00 GMT',
    language: 'en',
    ttl: '60',
    itunesSubtitle: 'A show about everything',
    itunesAuthor: 'John Doe',
    itunesSummary:
      'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
    itunesOwner: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Technology',
        subcats: [
          {
            text: 'Software',
            subcats: [
              {
                text: 'node.js'
              }
            ]
          }
        ]
      }
    ]
  };
  const item = {
    title: 'item 1',
    description: 'description 1',
    url: 'http://example.com/article1',
    date: 'May 24, 2012 04:00:00 GMT',
    itunesAuthor: 'John Doe',
    itunesSubtitle: 'A short primer on table spices',
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
    itunesDuration: 424,
    itunesEpisode: 1,
    itunesSeason: 1,
    itunesTitle: 'itunes item 1',
    itunesEpisodeType: 'full'
  };
  const feed = new Podcast(feedInfo, [item]);

  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.podcast.trim());
});

it('preformatted duration', () => {
  const feed = new Podcast({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    author: 'Dylan Greene',
    pubDate: 'May 20, 2012 04:00:00 GMT',
    language: 'en',
    ttl: '60',
    itunesSubtitle: 'A show about everything',
    itunesAuthor: 'John Doe',
    itunesSummary:
      'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
    itunesOwner: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Technology',
        subcats: [
          {
            text: 'Software',
            subcats: [
              {
                text: 'node.js'
              }
            ]
          }
        ]
      }
    ]
  });

  feed.addItem({
    title: 'item 1',
    description: 'description 1',
    url: 'http://example.com/article1',
    date: 'May 24, 2012 04:00:00 GMT',
    itunesAuthor: 'John Doe',
    itunesSubtitle: 'A short primer on table spices',
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
    itunesDuration: '7:04',
    itunesEpisode: 1,
    itunesSeason: 1,
    itunesTitle: 'itunes item 1',
    itunesEpisodeType: 'full'
  });

  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.preformattedDuration.trim());
});

it('html content', () => {
  const feed = new Podcast({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    author: 'Dylan Greene',
    pubDate: 'May 20, 2012 04:00:00 GMT',
    language: 'en',
    ttl: '60',
    itunesSubtitle: 'A show about everything',
    itunesAuthor: 'John Doe',
    itunesSummary:
      'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
    itunesOwner: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Technology',
        subcats: [
          {
            text: 'Software',
            subcats: [
              {
                text: 'node.js'
              }
            ]
          }
        ]
      }
    ]
  });

  feed.addItem({
    title: 'item 1',
    description: 'description 1',
    url: 'http://example.com/article1',
    date: 'May 24, 2012 04:00:00 GMT',
    content: '<a href="https://www,google.de">Google</a>',
    itunesAuthor: 'John Doe',
    itunesSubtitle: 'A short primer on table spices',
    itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
    itunesDuration: 424,
    itunesEpisode: 1,
    itunesSeason: 1,
    itunesTitle: 'itunes item 1',
    itunesEpisodeType: 'full'
  });

  assert.strictEqual(feed.buildXml({ indent: '  ' }), expectedOutput.htmlContent.trim());
});
