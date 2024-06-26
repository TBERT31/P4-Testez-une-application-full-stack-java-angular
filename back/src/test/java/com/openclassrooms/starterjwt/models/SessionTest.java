package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@DataJpaTest
@TestPropertySource(locations = "classpath:application-integrationtest.properties")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback
@Transactional
public class SessionTest {

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    public void testEquals() {
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Session session1 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session2 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session3 = new Session(2L, "Session2", date, "Description2", null, null, now, now);

        assertThat(session1).isEqualTo(session2);
        assertThat(session1).isNotEqualTo(session3);
        assertThat(session1).isNotEqualTo(null);
        assertThat(session1).isNotEqualTo("string");
    }

    @Test
    public void testHashCode() {
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Session session1 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session2 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session3 = new Session(2L, "Session2", date, "Description2", null, null, now, now);

        assertThat(session1.hashCode()).isEqualTo(session2.hashCode());
        assertThat(session1.hashCode()).isNotEqualTo(session3.hashCode());
    }

    @Test
    public void testSetters() {
        Session session = new Session();
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Teacher teacher = new Teacher();

        User user1 = new User(1L, "user1@test.com", "lastName1", "firstName1", "password123", false, null, null);
        User user2 = new User(2L, "user2@test.com", "lastName2", "firstName2", "password456", false, null, null);
        List<User> users = Arrays.asList(user1, user2);

        session.setId(1L);
        session.setName("Session1");
        session.setDate(date);
        session.setDescription("Description1");
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(now);
        session.setUpdatedAt(now);

        assertThat(session)
                .isNotNull()
                .extracting("id", "name", "description", "teacher", "users", "createdAt", "updatedAt")
                .containsExactly(
                        1L,
                        "Session1",
                        "Description1",
                        teacher,
                        users,
                        now,
                        now
                );
    }

    @Test
    public void testCanEqual() {
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Session session1 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session2 = new Session(1L, "Session1", date, "Description1", null, null, now, now);
        Session session3 = new Session(2L, "Session2", date, "Description2", null, null, now, now);

        assertThat(session1.canEqual(session2)).isTrue();
        assertThat(session1.canEqual(session3)).isTrue();
        assertThat(session1.canEqual("string")).isFalse();
    }
    @Test
    public void testBuilder() {
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Teacher teacher = new Teacher();

        User user1 = new User(1L, "user1@test.com", "lastName1", "firstName1", "password123", false, null, null);
        User user2 = new User(2L, "user2@test.com", "lastName2", "firstName2", "password456", false, null, null);
        List<User> users = Arrays.asList(user1, user2);

        Session session = Session.builder()
                .id(1L)
                .name("Session1")
                .date(date)
                .description("Description1")
                .teacher(teacher)
                .users(users)
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertThat(session)
                .isNotNull()
                .extracting("id", "name", "description", "teacher", "users", "createdAt", "updatedAt")
                .containsExactly(
                        1L,
                        "Session1",
                        "Description1",
                        teacher,
                        users,
                        now,
                        now
                );
    }

    @Test
    public void testEqualsAndHashCodeEdgeCases() {
        Session session1 = new Session();
        Session session2 = new Session();

        // Both objects are new and have null ids
        assertThat(session1).isEqualTo(session2);
        assertThat(session1.hashCode()).isEqualTo(session2.hashCode());

        // One object has an id, the other does not
        session1.setId(1L);
        assertThat(session1).isNotEqualTo(session2);
        assertThat(session1.hashCode()).isNotEqualTo(session2.hashCode());

        // Both objects have the same id
        session2.setId(1L);
        assertThat(session1).isEqualTo(session2);
        assertThat(session1.hashCode()).isEqualTo(session2.hashCode());

        // Different ids
        session2.setId(2L);
        assertThat(session1).isNotEqualTo(session2);
        assertThat(session1.hashCode()).isNotEqualTo(session2.hashCode());
    }

}
