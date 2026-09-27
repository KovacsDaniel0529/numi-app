package com.szakdoga.numi.repository;

import com.szakdoga.numi.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food,Long> {
    // Spring Data JPA varázslat:
    // A metódus nevéből: findBy + Name + Containing + IgnoreCase
    // A háttérben ebből pontosan ez az SQL fog generálódni:
    // SELECT * FROM foods WHERE LOWER(name) LIKE LOWER('%keresett_szo%');
    List<Food> findByNameContainingIgnoreCase(String name);
    // Későbbi bővítéshez: ha kategória szerint akarsz szűrni
    List<Food> findByCategoryIgnoreCase(String category);
}