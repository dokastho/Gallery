INSERT INTO users(username, fullname, email, filename, password)
VALUES ('dokastho', 'TJ Dokas', 'dokastho@umich.edu', 'profile.jpg', 'password');
INSERT INTO users(username, fullname, email, filename, password)
VALUES ('admin', 'admin', 'dokastho@umich.edu', 'profile.jpg', 'password');

INSERT INTO albums(owner, name)
VALUES ('admin', 'profiles');
INSERT INTO albums(owner, name)
VALUES ('dokastho', 'Outdoors');
INSERT INTO albums(owner, name)
VALUES ('dokastho', 'LinkedIn');

INSERT INTO sharing(user, albumid) VALUES ('dokastho', 2);
INSERT INTO sharing(user, albumid) VALUES ('dokastho', 3);

INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 3, 'img_0.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_1.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_2.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_3.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_4.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_5.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 3, 'img_6.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 3, 'img_7.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_8.jpg');
INSERT INTO pictures(owner, albumid, fileid) VALUES ('dokastho', 2, 'img_9.jpg');
