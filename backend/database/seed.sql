BEGIN;

TRUNCATE TABLE
    leaderboard_entries,
    streak_freezes,
    lesson_attempts,
    user_lesson_progress,
    exercises,
    lessons,
    units,
    sections,
    user_courses,
    courses
RESTART IDENTITY CASCADE;

-- SPANISH COURSE
DO $$
DECLARE
    v_course UUID;
    v_section UUID;
    v_unit UUID;
    v_lesson UUID;
BEGIN
    INSERT INTO courses (source_language_code, source_language_name, target_language_code, target_language_name, title, flag_key)
    VALUES ('en', 'English', 'es', 'Spanish', 'Spanish', 'spain')
    RETURNING id INTO v_course;

    INSERT INTO sections (course_id, sort_order, title, subtitle)
    VALUES (v_course, 1, 'Section 1: Rookie', 'Start using basic Spanish')
    RETURNING id INTO v_section;

    -- Unit 1
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 1, 'Unit 1', 'Introduce yourself and use basic greetings')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'Greetings', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Select the correct meaning', 'Hola', 'Hello', '{"options":["Hello","Goodbye","Thank you","Please"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate this phrase', 'Buenos días', 'Good morning', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Translate this phrase', 'Good evening', 'Buenas noches', '{"words":["Buenas","noches","días","Hola"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'Introduce yourself', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct translation', 'Me llamo Ana', 'My name is Ana', '{"options":["My name is Ana","I like Ana","Goodbye Ana","Ana is my friend"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'My name is Mark', 'Me llamo Mark', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I am from England', 'Soy de Inglaterra', '{"words":["Soy","de","Inglaterra","España","Yo"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'Common phrases', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Select the correct meaning', 'Gracias', 'Thank you', '{"options":["Thank you","Hello","Sorry","Goodbye"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'Please', 'Por favor', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'Thank you very much', 'Muchas gracias', '{"words":["Muchas","gracias","Hola","favor"]}'::jsonb);

    -- Unit 2
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 2, 'Unit 2', 'Talk about food and drinks')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'Food', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Pan', 'Bread', '{"options":["Bread","Milk","Water","Apple"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'Apple', 'Manzana', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I eat bread', 'Yo como pan', '{"words":["Yo","como","pan","bebo","agua"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'Drinks', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct translation', 'Agua', 'Water', '{"options":["Water","Coffee","Milk","Tea"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'Coffee', 'Café', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I drink water', 'Yo bebo agua', '{"words":["Yo","bebo","agua","como","pan"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'At a restaurant', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct meaning', 'La cuenta, por favor', 'The bill, please', '{"options":["The bill, please","A table for two","I want water","Good morning"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'A table for two', 'Una mesa para dos', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I want coffee', 'Quiero café', '{"words":["Quiero","café","agua","como"]}'::jsonb);

    -- Unit 3
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 3, 'Unit 3', 'Talk about family and everyday life')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'Family', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Madre', 'Mother', '{"options":["Mother","Father","Sister","Brother"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'Brother', 'Hermano', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'My sister is nice', 'Mi hermana es amable', '{"words":["Mi","hermana","es","amable","hermano"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'Home', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Casa', 'House', '{"options":["House","School","Street","Room"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'Kitchen', 'Cocina', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'The house is big', 'La casa es grande', '{"words":["La","casa","es","grande","pequeña"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'Daily routine', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct meaning', 'Trabajo', 'I work', '{"options":["I work","I sleep","I eat","I study"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into Spanish', 'I study', 'Estudio', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I sleep at night', 'Duermo por la noche', '{"words":["Duermo","por","la","noche","mañana"]}'::jsonb);

END $$;

-- FRENCH COURSE
DO $$
DECLARE
    v_course UUID;
    v_section UUID;
    v_unit UUID;
    v_lesson UUID;
BEGIN
    INSERT INTO courses (source_language_code, source_language_name, target_language_code, target_language_name, title, flag_key)
    VALUES ('en', 'English', 'fr', 'French', 'French', 'france')
    RETURNING id INTO v_course;

    INSERT INTO sections (course_id, sort_order, title, subtitle)
    VALUES (v_course, 1, 'Section 1: Rookie', 'Start using basic French')
    RETURNING id INTO v_section;

    -- Unit 1
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 1, 'Unit 1', 'Introduce yourself and use basic French greetings')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'French greetings', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Select the correct meaning', 'Bonjour', 'Hello', '{"options":["Hello","Goodbye","Thank you","Please"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Good evening', 'Bonsoir', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'Hello, how are you?', 'Bonjour comment ça va', '{"words":["Bonjour","comment","ça","va","merci"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'Introduce yourself in French', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct translation', 'Je m''appelle Marie', 'My name is Marie', '{"options":["My name is Marie","I like Marie","Marie is here","Goodbye Marie"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'My name is Paul', 'Je m''appelle Paul', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I am from France', 'Je suis de France', '{"words":["Je","suis","de","France","bonjour"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'French phrases', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Select the correct meaning', 'Merci', 'Thank you', '{"options":["Thank you","Hello","Sorry","Goodbye"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Please', 'S''il vous plaît', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'Thank you very much', 'Merci beaucoup', '{"words":["Merci","beaucoup","Bonjour","France"]}'::jsonb);

    -- Unit 2
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 2, 'Unit 2', 'Talk about French food and drinks')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'French food', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Pain', 'Bread', '{"options":["Bread","Milk","Water","Apple"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Apple', 'Pomme', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I eat bread', 'Je mange du pain', '{"words":["Je","mange","du","pain","eau"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'French drinks', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct translation', 'Eau', 'Water', '{"options":["Water","Coffee","Milk","Tea"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Coffee', 'Café', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I drink water', 'Je bois de l''eau', '{"words":["Je","bois","de","l''eau","pain"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'French restaurant', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct meaning', 'L''addition, s''il vous plaît', 'The bill, please', '{"options":["The bill, please","A table for two","I want water","Good morning"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'A table for two', 'Une table pour deux', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I want coffee', 'Je veux du café', '{"words":["Je","veux","du","café","eau"]}'::jsonb);

    -- Unit 3
    INSERT INTO units (section_id, sort_order, title, description)
    VALUES (v_section, 3, 'Unit 3', 'Talk about family in French')
    RETURNING id INTO v_unit;

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 1, 'French family', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Mère', 'Mother', '{"options":["Mother","Father","Sister","Brother"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Brother', 'Frère', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'My sister is nice', 'Ma sœur est gentille', '{"words":["Ma","sœur","est","gentille","frère"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 2, 'French home', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the translation', 'Maison', 'House', '{"options":["House","School","Street","Room"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'Kitchen', 'Cuisine', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'The house is big', 'La maison est grande', '{"words":["La","maison","est","grande","petite"]}'::jsonb);

    INSERT INTO lessons (unit_id, sort_order, title, xp_reward)
    VALUES (v_unit, 3, 'French daily life', 10)
    RETURNING id INTO v_lesson;
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 1, 'MULTIPLE_CHOICE', 'Choose the correct meaning', 'Je travaille', 'I work', '{"options":["I work","I sleep","I eat","I study"]}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 2, 'TYPE_ANSWER', 'Translate into French', 'I study', 'J''étudie', '{}'::jsonb);
    INSERT INTO exercises (lesson_id, sort_order, type, instruction, prompt, correct_answer, metadata_json)
    VALUES (v_lesson, 3, 'WORD_BANK', 'Build the sentence', 'I sleep at night', 'Je dors la nuit', '{"words":["Je","dors","la","nuit","matin"]}'::jsonb);

END $$;

COMMIT;

-- Quick verification
SELECT title, source_language_name, target_language_name FROM courses ORDER BY title;
SELECT COUNT(*) AS lesson_count FROM lessons;
SELECT COUNT(*) AS exercise_count FROM exercises;
