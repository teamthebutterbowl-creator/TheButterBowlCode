import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Heart, Tag, Percent, HandHeart } from 'lucide-react';
import styles from './About.module.css';

/**
 * useReveal — IntersectionObserver-based scroll reveal.
 */
const useReveal = (threshold = 0.25) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const Reveal = ({ children, className = '' }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}>
      {children}
    </div>
  );
};

const AboutPage = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={styles.page}>
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src="/about/About1.jpeg" 
          alt="A warm shared meal at a softly lit table, steam rising from a bowl"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={`${styles.heroContent} ${heroVisible ? styles.heroVisible : ''}`}>
          <span className={styles.eyebrow}>The Butter Bowl</span>
          <h1 className={styles.heroTitle}>
            Some meals stay
            <br />
            with us long after
            <br />
            they&rsquo;re over.
          </h1>
          <div className={styles.heroDivider} aria-hidden="true" />
          <p className={styles.heroText}>
            Not because they were extravagant or trendy. But because of how
            they made us feel.
          </p>
          <a href="#story" className={styles.heroButton}>
            Read Our Story
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollCueLabel}>Scroll</span>
          <span className={styles.scrollCueDot} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE MOMENTS THAT INSPIRED US                                  */}
      {/* ============================================================ */}
      <section className={styles.moments}>
        <Reveal className={styles.momentsHeader}>
          <span className={styles.eyebrowDark}>The moments that inspired us</span>
          <h2 className={styles.sectionTitle}>The moments that inspired us.</h2>
        </Reveal>

        <div className={styles.momentsGrid}>
          <Reveal className={styles.momentCard}>
            <div className={styles.momentIcon}>
              <Home size={26} strokeWidth={1.5} />
            </div>
            <h3>Coming Home</h3>
            <p>
              The warmth of walking through the door after a long day and
              finally sitting down to eat.
            </p>
          </Reveal>

          <Reveal className={styles.momentCard}>
            <div className={styles.momentIcon}>
              <Users size={26} strokeWidth={1.5} />
            </div>
            <h3>Sharing Meals</h3>
            <p>
              Conversations, laughter, and stories that happen around a meal.
            </p>
          </Reveal>

          <Reveal className={styles.momentCard}>
            <div className={styles.momentIcon}>
              <Heart size={26} strokeWidth={1.5} />
            </div>
            <h3>That First Bite</h3>
            <p>
              The simple joy of food that feels comforting, familiar, and
              satisfying.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* QUOTE BAND                                                    */}
      {/* ============================================================ */}
      <section className={styles.quoteBand}>
        <div className={styles.quoteBandDecoration} aria-hidden="true" />
        <Reveal className={styles.quoteBandContent}>
          <p className={styles.quoteBandText}>
            &ldquo;It was the extra spoonful,
            <br />
            added with love.&rdquo;
          </p>
          <p className={styles.quoteBandSub}>This is where our story began.</p>
        </Reveal>
      </section>

      {/* ============================================================ */}
      {/* OUR STORY — image + text                                      */}
      {/* ============================================================ */}
      <section id="story" className={styles.story}>
        <div className={styles.storyImage}>
          <img
            src="/Image1.jpeg"
            alt="Golden butter melting over warm bread in a rustic bowl"
          />
        </div>

        <Reveal className={styles.storyContent}>
          <span className={styles.eyebrowDark}>Our Story</span>
          <h2 className={styles.storyTitle}>
            Growing up, butter was never just an ingredient.
          </h2>
          <ul className={styles.storyList}>
            <li>It was care.</li>
            <li>It was warmth.</li>
            <li>
              It was someone saying,
              <span className={styles.storyHighlight}>
                &ldquo;I thought about you.&rdquo;
              </span>
            </li>
          </ul>
          <p className={styles.storyBody}>
            The Butter Bowl was built around that feeling. In a world where
            food often feels rushed and transactional, we exist to bring
            comfort back to the table.
          </p>
        </Reveal>
      </section>

      {/* ============================================================ */}
      {/* WHAT WE BELIEVE                                               */}
      {/* ============================================================ */}
      <section className={styles.believe}>
        <Reveal className={styles.believeHeader}>
          <span className={styles.eyebrowDark}>What We Believe</span>
          <h2 className={styles.sectionTitle}>
            Every bowl should leave someone happier.
          </h2>
        </Reveal>

        <div className={styles.believeGrid}>
          <Reveal className={styles.believeCard}>
            <div className={styles.believeIcon}>
              <Heart size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3>Comfort First</h3>
              <p>
                We create meals that feel warm, familiar, and deeply
                satisfying.
              </p>
            </div>
          </Reveal>

          <Reveal className={styles.believeCard}>
            <div className={styles.believeIcon}>
              <Users size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3>Made To Be Shared</h3>
              <p>
                Food brings people together and turns moments into memories.
              </p>
            </div>
          </Reveal>

          <Reveal className={styles.believeCard}>
            <div className={styles.believeIcon}>
              <HandHeart size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3>Crafted With Care</h3>
              <p>
                We pay attention to the little things that make a big
                difference.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* A QUESTION FOR YOU                                            */}
      {/* ============================================================ */}
      <section className={styles.question}>
        <Reveal className={styles.questionLeft}>
          <span className={styles.eyebrowDark}>A Question For You</span>
          <h2 className={styles.questionTitle}>
            What&rsquo;s the meal
            <br />
            you still remember?
          </h2>
        </Reveal>

        <div className={styles.questionGrid}>
          <Reveal className={styles.questionItem}>
            <Tag size={24} strokeWidth={1.5} />
            <p>People don&rsquo;t remember prices.</p>
          </Reveal>
          <Reveal className={styles.questionItem}>
            <Percent size={24} strokeWidth={1.5} />
            <p>People don&rsquo;t remember discounts.</p>
          </Reveal>
          <Reveal className={styles.questionItem}>
            <Heart size={24} strokeWidth={1.5} />
            <p>People remember moments.</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CLOSING                                                       */}
      {/* ============================================================ */}
      <section className={styles.closing}>
        <div className={styles.closingImage}>
          <img
            src="/about/About3.jpeg"
            alt="A comforting bowl of butter rice garnished with herbs, served on a wooden board"
          />
        </div>

        <Reveal className={styles.closingContent}>
          <p className={styles.closingLead}>Food is more than ingredients.</p>
          <p className={styles.closingAccent}>
            It&rsquo;s comfort. It&rsquo;s connection. It&rsquo;s memory.
          </p>

          <div className={styles.closingBrand}>
            <span className={styles.closingBrandName}>The Butter Bowl</span>
            <span className={styles.closingTagline}>
              The Bowl That Melts Hearts
              <Heart size={16} strokeWidth={2} className={styles.closingHeartIcon} />
            </span>
          </div>

          <Link to="/menu" className={styles.closingButton}>
            Explore The Menu
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
};

export default AboutPage;